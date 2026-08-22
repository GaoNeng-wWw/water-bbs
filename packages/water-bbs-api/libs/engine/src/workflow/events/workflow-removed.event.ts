import { IEvent } from '@nestjs/cqrs';
import { WorkflowId } from '../workflow.entity';

export const WORKFLOW_REMOVED_ID = 'engine.workflow.removed';
export class WorkflowRemoved implements IEvent {
  id = WORKFLOW_REMOVED_ID;
  constructor(public readonly workflowId: WorkflowId) {}
}
