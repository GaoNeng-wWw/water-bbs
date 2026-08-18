import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';

export type TriggerId = string & { readonly __brand: unique symbol };
export const createTriggerId = () => v7() as TriggerId;

export enum TriggerKind {
  Condition = 'condition',
  Cron = 'cron',
}

@Entity()
export class Trigger extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<TriggerId> = createTriggerId();
  @Property({ type: 'text' })
  name: string;
  @Enum(() => TriggerKind)
  kind: TriggerKind = TriggerKind.Condition;
  @Property({ type: 'text', nullable: true })
  condition?: string;
  @Property({ type: 'text', nullable: true })
  cron?: string;
  @Property({ type: 'uuid' })
  workflowId: string;
  @Property({ type: 'bool' })
  enable?: Opt<boolean> = true;
}
