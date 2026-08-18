import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';

export type WorkflowId = string & { readonly __brand: unique symbol };
export type Dag = {
  step: string;
  edges: {
    from: string;
    to: string;
  }[];
};

@Entity()
export class WorkflowEntity extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<WorkflowId> = v7() as WorkflowId;
  @Property({ type: 'text' })
  name: string;
  @Property({ type: 'longtext' })
  dag: string;
  getDag(){
    return JSON.parse(this.dag) as Dag;
  }
}
