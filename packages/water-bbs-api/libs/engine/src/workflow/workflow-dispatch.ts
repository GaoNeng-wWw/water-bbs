import { EntityManager } from '@mikro-orm/sqlite';
import { WorkflowEntity, WorkflowId } from './workflow.entity';

export class WorkflowDispatch {
  constructor(
    private readonly em: EntityManager
  ) {}
  async dispatch(workflowId: WorkflowId) {
    const workflow = await this.em.findOne(WorkflowEntity, { id: workflowId });
    if (!workflow) {
      return;
    }
    const dag = workflow.getDag();
    // 获取step然后运行
  }
}
