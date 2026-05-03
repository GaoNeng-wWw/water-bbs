import { ValueObject } from 'types-ddd';

export type CertProp = {
  cert_type: string;
  cert_value: string;
};

export class Cert extends ValueObject<CertProp> {
  constructor(prop: CertProp) {
    super(prop);
  }
}
