import { TriggerFired } from '@app/engine/trigger/events';
import { EntityManager } from '@mikro-orm/sqlite';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WorkflowEntity } from '../workflow.entity';
import { StepDiscoverService } from '@app/engine/step';

@EventsHandler(TriggerFired)
export class OnTriggerFire implements IEventHandler<TriggerFired> {
  constructor(
    private em: EntityManager,
    private stepRegistry: StepDiscoverService,
  ) {}
  async handle({ workflowId, events, initParam }: TriggerFired) {
    const workflow = await this.em.findOne(WorkflowEntity, { id: workflowId });
    if (!workflow) {
      return;
    }
    const stepIds = workflow.steps;
    const steps = stepIds.map((id) => this.stepRegistry.getById(id));
    for (const stepResult of steps) {
      if (stepResult.isErr()) {
        return stepResult;
      }
    }
    this.em.transactional((em) => {
      const stepRunTasks = steps
        .map((step) => (step.isOk() ? step.value : undefined))
        .filter((value) => value !== undefined)
        .map((handler) => {
          return handler.handle(initParam, { em, events }).then((result) => {
            if (result.isErr()) {
              throw result.error;
            }
          });
        });
      return Promise.all(stepRunTasks);
    });
  }
}
