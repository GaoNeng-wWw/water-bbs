import { EntityManager, Type } from '@mikro-orm/core';
import { OnApplicationBootstrap } from '@nestjs/common';
import { Trigger, TriggerKind } from './trigger.entity';
import { Engine } from 'json-rules-engine';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

export class TriggerRegistryService implements OnApplicationBootstrap {
  constructor(
    private readonly em: EntityManager,
    private readonly ruleEngine: Engine,
    private readonly cronEngine: SchedulerRegistry,
  ) {}
  async onApplicationBootstrap() {
    const triggers = await this.em.findAll(Trigger, {
      where: { enable: true },
    });
    triggers.forEach((trigger) => {
      if (trigger.kind === TriggerKind.Condition) {
        this.ruleEngine.addRule({
          ...JSON.parse(trigger.condition || '{}'),
          event: {
            type: 'workflow.start',
            params: {
              workflowId: trigger.workflowId,
              triggerId: trigger.id,
            },
          },
        });
        return;
      }
      if (trigger.kind === TriggerKind.Cron && trigger.cron) {
        this.cronEngine.addCronJob(
          trigger.name,
          new CronJob(trigger.cron, async () => {
            // 手动触发workflow
          }),
        );
      }
    });
  }
}