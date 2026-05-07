export class CreateAccountDTO {
  username!: string;
  ident_type!: string;
  ident_value!: string;
  cert_type!: string;
  cert_value!: string;
  invite_code?: string;
  captcha?: string;
  constructor(prop: typeof CreateAccountDTO) {
    Object.assign(this, prop);
  }
}

export class CreateAccountResponse {
  public account_id: string;
  constructor(account_id: string) {
    this.account_id = account_id;
  }
}
