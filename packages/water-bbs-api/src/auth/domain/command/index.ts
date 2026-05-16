import { OnAccountRemovedHandler } from './on-account-removed';
import { OnAccountResetPasswordHandler } from './on-account-reset-password';
import { OnAccountUpdatedPasswordHandler } from './on-account-update-password';

export { OnAccountRemovedHandler } from './on-account-removed';
export { OnAccountResetPasswordHandler } from './on-account-reset-password';
export { OnAccountUpdatedPasswordHandler } from './on-account-update-password';

export const handlers = [
  OnAccountRemovedHandler,
  OnAccountResetPasswordHandler,
  OnAccountUpdatedPasswordHandler,
];
