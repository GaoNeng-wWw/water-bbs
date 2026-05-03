import { Ok, ValueObject } from 'types-ddd';
import { v7 } from 'uuid';

export type PermissionCodeProp = {
  value: string;
};
export class PermissionCode extends ValueObject<PermissionCodeProp> {
  constructor(prop: PermissionCodeProp) {
    super(prop);
  }
}

export type PermissionIdProp = {
  value: string;
};
export class PermissionId extends ValueObject<PermissionIdProp> {
  constructor(prop: PermissionIdProp) {
    super(prop);
  }
  static create() {
    return Ok(new PermissionId({ value: v7() }));
  }
}
