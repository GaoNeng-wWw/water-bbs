import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { BaseMetaEntity } from "./meta";

@Entity()
export class Policy<Value> extends BaseMetaEntity {
  @PrimaryKey({ type: 'string' })
  id: string;
  @Property({ type: 'jsonb' })
  schema: Record<string, any>;
  @Property({ type: 'jsonb', nullable: false })
  value: Value;
  constructor(
    id: string,
    schema: Record<string, any>,
    value: Value,
  ) {
    super()
    this.id = id;
    this.schema = schema;
    this.value = value;
  }

  static fromObject<Value>(
    {id,schema,value}: {id: string, schema: Record<string, any>, value: Value}
  ) {
    return new Policy(id,schema,value)
  }
}
