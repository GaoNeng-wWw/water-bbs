import { ValueObject } from 'types-ddd';

export type IdentProp = {
  id: string;
  ident_type: string;
  ident_value: string;
  verified: boolean;
};

export class Ident extends ValueObject<IdentProp> {
  constructor(prop: IdentProp) {
    super(prop);
  }
  verify(): Ident {
    return this.clone({ verified: true });
  }
  isVerified(): boolean {
    return this.get('verified');
  }
}
