import { type Opt } from '@mikro-orm/core';
import {
  BeforeUpdate,
  Embeddable,
  Filter,
  Property,
} from '@mikro-orm/decorators/legacy';
import { err, ok } from 'neverthrow';
import {
  EndMustAfterAfterStartError,
  ReasonRequiredError,
} from './errors/hidden-period.error';

@Filter({
  name: 'notRemoved',
  cond: {
    removedAt: null,
  },
  default: true,
})
@Embeddable()
export class MetaEntity {
  @Property({ type: 'datetime', index: true })
  createdAt: Opt<Date> = new Date();
  @Property({ type: 'datetime', index: true, nullable: true })
  removedAt: Opt<Date> | null;
  @Property({ type: 'datetime', index: true, nullable: true })
  updatedAt: Opt<Date>;

  @BeforeUpdate()
  onUpdate() {
    this.updatedAt = new Date();
  }
  _remove() {
    this.removedAt = new Date();
  }
  _recover() {
    this.removedAt = null;
  }
}

@Filter({
  name: 'notHidden',
  cond: {
    end: {
      $lt: new Date(),
    },
  },
  default: true,
})
@Embeddable()
export class HiddenPeriod {
  @Property({
    type: 'date',
  })
  start: Date;

  @Property({
    type: 'date',
  })
  end?: Date;

  @Property({
    type: 'text',
  })
  reason: string;

  private constructor(start: Date, reason: string, end?: Date) {
    this.start = start;
    this.end = end;
    this.reason = reason;
  }

  static create(reason: string, end?: Date) {
    if (end && end <= new Date()) {
      return err(new EndMustAfterAfterStartError());
    }

    if (!reason.trim()) {
      return err(new ReasonRequiredError());
    }

    return ok(new HiddenPeriod(new Date(), reason, end));
  }

  isExpired(now = new Date()) {
    return this.end ? now >= this.end : false;
  }
}
