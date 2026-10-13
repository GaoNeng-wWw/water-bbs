import { type Opt } from '@mikro-orm/core';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { type AccountId } from 'src/auth';
import { v7 } from 'uuid';
import { type TaskID } from './task-def';
import { type Operator, ValueType } from '../../schema';

export type UserTaskProgressID = string & { readonly __brand: unique symbol };
export const createUserTaskProgressID = () => v7() as UserTaskProgressID;
export const toUserTaskProgressID = (value: string) =>
  value as UserTaskProgressID;

export type TaggedValue =
  | {
      kind: 'string';
      value: string;
    }
  | {
      kind: 'boolean';
      value: boolean;
    }
  | {
      kind: 'number';
      value: number;
    }
  | {
      kind: 'array';
      value: TaggedValue[];
    }
  | {
      kind: 'null';
      value: null;
    };

export const valueToTaggedValue = (value: ValueType): TaggedValue => {
  if (typeof value === 'string') {
    return { kind: 'string', value };
  }
  if (typeof value === 'boolean') {
    return { kind: 'boolean', value };
  }
  if (typeof value === 'number') {
    return { kind: 'number', value };
  }
  if (Array.isArray(value)) {
    return { kind: 'array', value: value.map((v) => valueToTaggedValue(v)) };
  }
  return { kind: 'null', value: null };
};

@Entity()
export class UserTaskProgress {
  @PrimaryKey({
    type: 'uuid',
    onCreate: createUserTaskProgressID,
  })
  id: Opt<UserTaskProgressID>;
  @Property({ type: 'varchar' })
  conditionID: string;
  @Property({ type: 'uuid' })
  userID: AccountId;
  @Property({ type: 'uuid' })
  taskID: TaskID;
  @Property({ type: 'jsonb' })
  goal: TaggedValue;
  @Property({ type: 'varchar' })
  operator: Operator;
  @Property({ type: 'jsonb' })
  current: TaggedValue;
}
