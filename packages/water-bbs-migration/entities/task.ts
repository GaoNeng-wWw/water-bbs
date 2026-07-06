import { Embeddable, Embedded, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v7 } from "uuid";
import { BaseMetaEntity } from "./meta";
import { NonFunctionKeys } from "water-bbs-shared";

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
  @Property({ type: 'json' })
  schema: Record<string, any>
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

  constructor(props: NonFunctionKeys<Period>){
    Object.assign(this, props);
  }
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
  @Property({ type: 'json' })
  param: Record<string, any>

  constructor(
    props: Pick<Task, NonFunctionKeys<Task>>
  ) {
    super();
    
    Object.assign(this, props)
  }
  static create(
    code: string,
    label: string,
    description: string,
    condition: Record<string, any>,
    period: Period,
    param: Record<string, any>
  ) {
    return new Task(
      {id: v7(), code, label, description, condition, period, createdAt: new Date(), param}
    )
  }

  remove(){
    this.removedAt = new Date();
  }
  isOnce(){
    return this.period.unit === PeriodUnit.Once;
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
  Claim = 'pending',
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
  @Property({ type: 'date', nullable: true })
  completedAt?: Date;
  @Property({ type: 'date' })
  claimAt: Date;

  static create(
    userId: string,
    taskId: string,
    completedAt?: Date,
  ){
    return new UserTask(v7(), userId, taskId, TaskStatus.Claim, new Date(), completedAt)
  }

  constructor(
    id: string,
    userId: string,
    taskId: string,
    status: TaskStatus,
    claimAt: Date,
    completedAt?: Date,
  ) {
    super();
    this.id = id;
    this.userId = userId;
    this.taskId = taskId;
    this.status = status;
    this.claimAt = claimAt;
    this.completedAt = completedAt;
  }

  complete() {
    this.status = TaskStatus.Completed;
  }
  claim(){
    this.status = TaskStatus.Claim;
  }
  remove(){
    this.removedAt = new Date();
  }
}