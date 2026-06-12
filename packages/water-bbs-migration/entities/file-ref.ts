import { Embeddable, Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

// TODO: 
// 这里改成Entity, 其他表通过storageKey关联
@Entity()
export class FileReference {
  @PrimaryKey({ type: 'string', length: 255, index: true, unique: true })
  storageKey: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'int' })
  size: number;

  @Property({ type: 'string' })
  mimeType: string;
  @Property({ type: 'string' })
  storageType: string

  constructor(storageKey: string, name: string, size: number, mimeType: string, storageType: string) {
    this.storageKey = storageKey;
    this.name = name;
    this.size = size;
    this.mimeType = mimeType;
    this.storageType = storageType;
  }
}