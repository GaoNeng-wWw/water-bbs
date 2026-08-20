import type { Opt } from '@mikro-orm/core';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';
import type { TriggerId } from '../trigger/trigger.entity';
import { MetaEntity } from '@app/shared';

export type WorkflowId = string & { readonly __brand: unique symbol };

@Entity()
export class WorkflowEntity extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<WorkflowId> = v7() as WorkflowId;
  @Property({ type: 'text' })
  name: string;
  @Property({ type: 'uuid' })
  triggerId: TriggerId;
  @Property({ type: 'jsonb' })
  steps: string[];
}
