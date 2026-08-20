import { MetaEntity } from '@app/shared';
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { type WorkflowId } from '../workflow';

export type TriggerId = string & { readonly __brand: unique symbol };

export enum TriggerKind {
  Condition,
  Cron,
}

@Entity({ tableName: 'trigger' })
export class TriggerEntity extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: TriggerId;
  @Property({ type: 'text' })
  name: string;
  @Property({ type: 'uuid' })
  workflowId: WorkflowId;
  @Enum(() => TriggerKind)
  kind: TriggerKind;
  @Property({ type: 'jsonb', nullable: true })
  condition?: Record<string, any>;
  @Property({ type: 'string', nullable: true })
  cron?: string;
}
