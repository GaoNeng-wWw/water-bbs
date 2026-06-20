import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v7 } from "uuid";

@Entity({})
export class Resource {
  @PrimaryKey({type: 'uuid'})
  id: string;
  @Property({ type: 'uuid', index: true })
  subject: string;
  @Property({ type: 'int', default: 0 })
  cost: number;
  @Property({ type: 'uuid', index: true })
  fileReferenceId: string;

  constructor(id: string, cost: number, subject: string, fileReferenceId: string){
    this.id = id;
    this.cost = cost;
    this.subject = subject;
    this.fileReferenceId = fileReferenceId;
  }

  static build(
    cost: number,
    subject: string,
    fileReferenceId: string
  ){
    return new Resource(v7(), cost, subject, fileReferenceId);
  }
}


@Entity()
export class ResourceOwnerMap {
  @PrimaryKey({ type: 'uuid' })
  id: string;
  @Property({ type: 'uuid', index: true })
  owner: string;
  @Property({ type: 'uuid', index: true })
  resourceId: string;
}