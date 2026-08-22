import { IEvent } from '@nestjs/cqrs';
import { WorkflowId } from '../workflow.entity';

export const WORKFLOW_CREATED_ID = 'engine.workflow.created';
export class WorkflowCreated implements IEvent {
  id = WORKFLOW_CREATED_ID;
  constructor(public readonly workflowId: WorkflowId) {}
}
