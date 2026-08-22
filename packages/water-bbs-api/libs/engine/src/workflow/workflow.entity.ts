import type { Opt } from '@mikro-orm/core';
import {
  Embeddable,
  Embedded,
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';
import { MetaEntity } from '@app/shared';

export type WorkflowId = string & { readonly __brand: unique symbol };

export enum TriggerKind {
  Event,
  Cron,
}

@Embeddable()
export class TriggerEntity {
  @Enum(() => TriggerKind)
  kind: TriggerKind;
  @Property({ type: 'jsonb', nullable: true })
  events: string[];
  @Property({ type: 'jsonb', nullable: true })
  condition?: Record<string, any>;
  @Property({ type: 'string', nullable: true })
  cron?: string;
}

@Embeddable()
export class WorkflowStepEntity {
  @Property({ type: 'text' })
  name: string;
  @Property({ type: 'jsonb' })
  param: Record<string, any>;
}

@Entity({ tableName: 'workflow' })
export class WorkflowEntity extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<WorkflowId> = v7() as WorkflowId;
  @Property({ type: 'text' })
  name: string;
  @Embedded(() => TriggerEntity)
  trigger: TriggerEntity;
  @Property({ type: 'jsonb' })
  steps: WorkflowStepEntity[];

  remove() {
    this.removedAt = new Date();
  }
}
