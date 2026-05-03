import { Ok, ValueObject } from 'types-ddd';
import { v7 } from 'uuid';

export type RoleCodeProp = {
  value: string;
};
export class RoleCode extends ValueObject<RoleCodeProp> {
  constructor(prop: RoleCodeProp) {
    super(prop);
  }
}

export type RoleIdProp = {
  value: string;
};

export class RoleId extends ValueObject<RoleIdProp> {
  constructor(prop: RoleIdProp) {
    super(prop);
  }
  static create() {
    return Ok(new RoleId({ value: v7() }));
  }
}
