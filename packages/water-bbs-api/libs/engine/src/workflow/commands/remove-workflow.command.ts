import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { WorkflowEntity, WorkflowId } from '../workflow.entity';
import { DomainError } from '@app/shared';
import { EntityManager } from '@mikro-orm/sqlite';
import { WorkflowNotFound } from '../error';

export class RemoveWorkflow extends Command<Result<WorkflowId, DomainError>> {
  constructor(public readonly workflowId: WorkflowId) {
    super();
  }
}

@CommandHandler(RemoveWorkflow)
export class RemoveWorkflowService implements ICommandHandler<RemoveWorkflow> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    command: RemoveWorkflow,
  ): Promise<Result<WorkflowId, DomainError>> {
    const workflow = await this.em.findOne(WorkflowEntity, {
      id: command.workflowId,
    });
    if (!workflow) {
      return err(new WorkflowNotFound());
    }
    workflow.remove();
    await this.em.upsert(WorkflowEntity, workflow);
    return ok(workflow.id);
  }
}
