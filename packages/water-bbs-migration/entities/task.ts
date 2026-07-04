import { Embeddable, Embedded, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v7 } from "uuid";
import { BaseMetaEntity } from "./meta";

@Entity()
export class Reward extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();
  @Property({ type: 'string', index: true })
  code: string;
  @Property({ type: 'string' })
  label: string;
  @Property({ type: 'string' })
  description: string;
  constructor(
    props: Reward
  ) {
    super();
    Object.assign(this, props);
  }
  static create(props: Omit<Reward, 'id' | 'createdAt'>) {
    return new Reward({...props, id: v7(), createdAt: new Date()})
  }
}

export enum PeriodUnit {
  Once = 'Once',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

@Embeddable()
export class Period {
  @Property({ type: 'string' })
  unit: PeriodUnit;
  @Property({ type: 'number' })
  value: number;
}

@Entity()
export class Task extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();
  @Property({ type: 'string', index: true })
  code: string;
  @Property({ type: 'string' })
  label: string;
  @Property({ type: 'string' })
  description: string;
  @Property({ type: 'json' })
  condition: Record<string, any>;
  @Embedded(()=>Period)
  period: Period;

  constructor(
    props: Omit<Task, 'remove'>
  ) {
    super();
    Object.assign(this, props);
  }

  remove(){
    this.removedAt = new Date();
  }
}

@Entity()
export class TaskReward extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();
  @Property({ type: 'uuid' })
  taskId: string;
  @Property({ type: 'uuid' })
  rewardId: string;

  constructor(
    props: Omit<TaskReward, 'remove'>
  ) {
    super();
    Object.assign(this, props);
  }

  static create(
    props: Omit<TaskReward, 'id' | 'createdAt' | 'remove'>
  ){
    return new TaskReward({...props, id: v7(), createdAt: new Date()})
  }

  remove(){
    this.removedAt = new Date();
  }
}

export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
}

@Entity()
export class UserTask extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();
  @Property({ type: 'uuid' })
  userId: string;
  @Property({ type: 'uuid' })
  taskId: string;
  @Property({ type: 'string' })
  status: TaskStatus;
  @Property({ type: 'date' })
  completedAt: Date;

  constructor(
    props: UserTask
  ) {
    super();
    Object.assign(this, props);
  }

  complete() {
    this.status = TaskStatus.Completed;
  }
}