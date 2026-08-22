import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TriggerKind, WorkflowEntity, WorkflowId } from './workflow.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { WorkflowService } from './workflow.service';
import { EventBus } from '@nestjs/cqrs';
import {
  WORKFLOW_CREATED_ID,
  WORKFLOW_REMOVED_ID,
  WorkflowCreated,
  WorkflowRemoved,
} from './events';
import { WorkflowNotFound } from './error';
import { err, ok } from 'neverthrow';
import { Subscription } from 'rxjs';

@Injectable()
export class WorkflowRegistryService implements OnApplicationBootstrap {
  private subscribe: Map<string, Subscription> = new Map();
  constructor(
    @InjectRepository(WorkflowEntity)
    private readonly repo: EntityRepository<WorkflowEntity>,
    private readonly scheduler: SchedulerRegistry,
    private readonly workflowService: WorkflowService,
    private readonly eventBus: EventBus,
  ) {}
  async onApplicationBootstrap() {
    const workflow = await this.repo.findAll({});
    workflow.forEach((entity) => this.install(entity));
  }
  async register(workflow: WorkflowEntity) {
    await this.repo.upsert(workflow);
    this.install(workflow);
    await this.eventBus.publish(new WorkflowCreated(workflow.id));
  }
  async get(id: WorkflowId) {
    const workflow = await this.repo.findOne({ id });
    if (!workflow) {
      return err(new WorkflowNotFound());
    }
    return ok(workflow);
  }
  async remove(id: WorkflowId) {
    const workflow = await this.repo.findOne({ id });
    if (!workflow) {
      return err(new WorkflowNotFound());
    }
    workflow.remove();
    await this.repo.upsert(workflow);
    await this.eventBus.publish(new WorkflowRemoved(workflow.id));
    return ok(workflow);
  }
  uninstall(workflow: WorkflowEntity) {
    if (workflow.trigger.kind === TriggerKind.Cron && workflow.trigger.cron) {
      const job = this.scheduler.getCronJob(workflow.trigger.cron);
      job.stop();
      this.scheduler.deleteCronJob(workflow.trigger.cron);
      return;
    }
    const sub = this.subscribe.get(workflow.id);
    if (!sub) {
      return;
    }
    sub.unsubscribe();
    this.subscribe.delete(workflow.id);
  }
  install(workflow: WorkflowEntity) {
    if (workflow.trigger.kind === TriggerKind.Cron) {
      const job = new CronJob(workflow.trigger.cron!, () => {
        this.workflowService.triggerWorkflow(workflow, [], {});
      });
      this.scheduler.addCronJob(workflow.trigger.cron!, job);
      return;
    }
    const unsubscrbie = this.eventBus.subscribe((event) => {
      if (
        event.id === WORKFLOW_CREATED_ID ||
        event.id === WORKFLOW_REMOVED_ID
      ) {
        return;
      }
      this.workflowService.triggerWorkflow(workflow, [event], {});
    });
    this.subscribe.set(workflow.id, unsubscrbie);
  }
}
