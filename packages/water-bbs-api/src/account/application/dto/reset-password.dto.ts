export class ResetPasswordDTO {
  ident_value!: string;
  password!: string;
  mfa_code!: string;
  force!: boolean;
}
