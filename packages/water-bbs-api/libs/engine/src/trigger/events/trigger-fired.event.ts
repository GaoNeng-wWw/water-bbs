import { IEvent } from '@nestjs/cqrs';
import { WorkflowId } from '../../workflow';
import { TriggerId } from '../trigger.entity';

export const TriggerFiredId = 'trigger.fired';

export class TriggerFired<
  Param extends Record<string, any> = Record<string, any>,
  Event extends IEvent[] = IEvent[],
> {
  id = TriggerFiredId;
  constructor(
    public readonly triggerId: TriggerId,
    public readonly workflowId: WorkflowId,
    public readonly initParam: Param = {} as unknown as Param,
    public readonly events: Event = [] as unknown as Event,
  ) {}
}
