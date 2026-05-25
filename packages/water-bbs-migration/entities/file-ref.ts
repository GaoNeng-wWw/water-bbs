import { Embeddable, Property } from "@mikro-orm/decorators/legacy";

@Embeddable()
export class FileReference {
  @Property({ type: 'string', length: 255 })
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