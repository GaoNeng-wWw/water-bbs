import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v7 } from "uuid";

@Entity()
export class Action {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();
  @Property({ type: 'text' })
  name: string;
  @Property({ type: 'json' })
  schema: Record<string, any>
  @Property({type: 'blob'})
  active: boolean = true;

  constructor(name: string, schema: Record<string, any>, active: boolean = true) {
    this.name = name;
    this.schema = schema;
    this.active = active;
  }

  static create(name: string, schema: Record<string, any>) {
    return new Action(name, schema, true);
  }

  disable(){
    this.active = false;
  }
  enable(){
    this.active = true;
  }
}