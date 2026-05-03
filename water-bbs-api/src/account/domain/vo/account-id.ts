import { Ok, ValueObject } from 'types-ddd';
import { v7 } from 'uuid';

export type AccountIDProp = {
  value: string;
};
export class AccountID extends ValueObject<AccountIDProp> {
  constructor(prop: AccountIDProp) {
    super(prop);
  }
  static build() {
    return Ok(new AccountID({ value: v7() }));
  }
}
