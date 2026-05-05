import { ApplicationServiceError } from 'water-bbs-shared';

export class InvalidInviteCode extends ApplicationServiceError {
  constructor() {
    super('INVALIDE_INVITE_CODE', 400, null, {});
  }
}
