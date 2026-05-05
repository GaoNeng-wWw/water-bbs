import { ApplicationServiceError } from 'water-bbs-shared';

export class RequireInviteCode extends ApplicationServiceError {
  constructor() {
    super('REQUIRE_INVITE_CODE', 400, null, {});
  }
}
