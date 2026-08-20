import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TriggerEntity, TriggerKind } from './trigger.entity';
import { CronJob } from 'cron';
import { EventBus, IEvent } from '@nestjs/cqrs';
import { TriggerFired, TriggerFiredId } from './events';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TriggerDiscover implements OnApplicationBootstrap {
  constructor(
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  async onApplicationBootstrap() {
    const em = this.em.fork();
    const triggers = await em.findAll(TriggerEntity);
    for (const trigger of triggers) {
      if (trigger.kind === TriggerKind.Cron) {
        const crobJob = new CronJob(trigger.cron!, () => {
          this.eventBus.publish(
            new TriggerFired<Record<string, any>, IEvent[]>(
              trigger.id,
              trigger.workflowId,
              {},
              [],
            ),
          );
        });
        this.schedulerRegistry.addCronJob(trigger.name, crobJob);
        continue;
      }
      this.eventBus.subscribe((event) => {
        if (event.id === TriggerFiredId) {
          return;
        }
        this.eventBus.publish(
          new TriggerFired(trigger.id, trigger.workflowId, {}, [event]),
        );
      });
    }
  }
}
