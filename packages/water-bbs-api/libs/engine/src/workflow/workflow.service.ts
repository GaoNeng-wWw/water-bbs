import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { WorkflowEntity } from './workflow.entity';
import { EntityRepository } from '@mikro-orm/core';
import { ok } from 'neverthrow';
import { StepDiscoverService } from '../step';
import { IEvent } from '@nestjs/cqrs';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowEntity)
    private readonly workflowRepository: EntityRepository<WorkflowEntity>,
    private readonly stepRegistry: StepDiscoverService,
  ) {}
  async triggerWorkflow(
    workflow: WorkflowEntity,
    events: IEvent[] = [],
    initParam: Record<string, any> = {},
  ) {
    const steps = workflow.steps.map((step) =>
      this.stepRegistry.getById(step.name),
    );
    const error = steps.find((step) => step.isErr());
    if (error) {
      return error;
    }
    await this.workflowRepository
      .getEntityManager()
      .transactional(async (em) => {
        const jobs = steps
          .map((step) => (step.isOk() ? step.value : null))
          .filter((val) => val !== null)
          .map((step) => {
            return step.handle(initParam, { em, events });
          });
        const runResult = await Promise.all(jobs);
        const runError = runResult.find((res) => res.isErr());
        if (runError) {
          throw runError.error;
        }
        return ok();
      });
  }
}
