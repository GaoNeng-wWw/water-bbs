import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v7 } from "uuid";
import { BaseMetaEntity } from "./meta";

@Entity()
export class Category extends BaseMetaEntity {
  @PrimaryKey({type: 'uuid'})
  id: string = v7()
  @Property({ type: 'char', length: 255 })
  name!: string;
  @Property({ nullable: true, type: 'uuid' })
  parentID?: string;

  constructor(name: string, parent?: string){
    super();
  }
  remove(){
    this.removedAt = new Date();
  }
}