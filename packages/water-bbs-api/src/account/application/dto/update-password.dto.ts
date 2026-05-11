import { AccountID } from 'src/account/domain';

export class UpdatePassword {
  constructor(
    public accountID: AccountID,
    public password: string,
    public mfaCode: string,
  ) {}
}
