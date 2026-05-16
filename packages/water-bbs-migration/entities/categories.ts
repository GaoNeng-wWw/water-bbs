import { Entity, Formula, OneToMany, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v7 } from "uuid";
import { BaseMetaEntity } from "./meta";
import { Collection } from "@mikro-orm/core";

@Entity()
export class Category extends BaseMetaEntity {
  @PrimaryKey({type: 'uuid'})
  id: string = v7()
  @Property({ type: 'char', length: 255 })
  name!: string;
  
  @Property({ nullable: true, type: 'uuid' })
  parentID?: string | null;


  @Formula((cols, tables)=>`(select count(*) from ${tables.name} as c where c.parent_id = ${cols.id}) > 0`, {type: 'boolean', persist: false})
  hasChildren!: boolean;

  constructor(name: string, parent?: string){
    super();
    this.name = name;
    this.parentID = parent ?? null;
  }
  remove(){
    this.removedAt = new Date();
  }
}