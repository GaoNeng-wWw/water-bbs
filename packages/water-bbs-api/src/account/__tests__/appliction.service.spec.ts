import { IRegisterPolicy, REGISTER_POLICY_TOKEN } from '@app/shared';
import { AccountService } from '../application';
import { AccountRegistor } from '../domain';
import {
  IInviteCode,
  InviteCodeRepositoryToken,
} from '../domain/repo/invite-code.repo';
import { CaptchaService } from '@app/captcha/captcha.service';
import { TestBed } from '@suites/unit';
import { isErr, ok, unwrapErr } from 'water-bbs-shared';
import { UnsupportedIdentType } from '../application/errors';
import { Mocked, vi } from 'vitest';
import { InvalidCaptcha } from '../application/errors/invalid-captcha';
import { InvalidInviteCode } from '../application/errors/invalid-invite-code';

describe(AccountService.name, () => {
  let account: AccountService;
  let policy: Mocked<IRegisterPolicy>;
  let codeStore: Mocked<IInviteCode>;
  let captcha: Mocked<CaptchaService>;
  const mailRegistorMock: Mocked<AccountRegistor> = {
    valid: vi.fn().mockResolvedValue(false),
    execute: vi.fn().mockResolvedValue(ok(true)),
  };
  describe('CreateAccount', () => {
    beforeEach(async () => {
      const { unit, unitRef } =
        await TestBed.solitary(AccountService).compile();
      account = unit;
      policy = unitRef.get(REGISTER_POLICY_TOKEN);
      codeStore = unitRef.get(InviteCodeRepositoryToken);
      captcha = unitRef.get(CaptchaService);
      (account as any).registor = [mailRegistorMock];
    });
    it('not found any registor', async () => {
      (account as any).registor = [];
      const val = await account.createAccount({
        username: '',
        ident_type: 'NOT_SUPPORTED_IDENT_TYPE',
        ident_value: '',
        cert_type: '',
        cert_value: '',
      });
      expect(isErr(val)).toBe(true);
      expect(unwrapErr(val)).toBeInstanceOf(UnsupportedIdentType);
    });
    describe('invite free & captcha free', () => {
      beforeEach(() => {
        policy.requireInviteCode.mockResolvedValue(ok(false));
        policy.requireCaptcha.mockResolvedValue(ok(false));
      });
      it('Even if the verification code is invalid, no error is returned', async () => {
        captcha.verify.mockResolvedValue(ok(false));
        const val = await account.createAccount({
          username: '',
          ident_type: 'email',
          ident_value: 'test@no-reply.com',
          cert_type: '',
          cert_value: '',
        });
        expect(isErr(val)).toBe(false);
      });
    });
    describe('captcha free', () => {
      beforeEach(() => {
        policy.requireInviteCode.mockResolvedValue(ok(true));
        policy.requireCaptcha.mockResolvedValue(ok(false));
      });
      it('invalid invite-code', async () => {
        codeStore.exists.mockResolvedValue(ok(false));
        const val = await account.createAccount({
          username: '',
          ident_type: 'email',
          ident_value: 'test@no-reply.com',
          cert_type: '',
          cert_value: '',
          invite_code: 'example',
        });
        expect(isErr(val)).toBe(true);
        expect(unwrapErr(val)).toBeInstanceOf(InvalidInviteCode);
      });

      it('valid invite-code', async () => {
        codeStore.exists.mockResolvedValue(ok(true));
        const val = await account.createAccount({
          username: '',
          ident_type: 'email',
          ident_value: 'test@no-reply.com',
          cert_type: '',
          cert_value: '',
          invite_code: 'example',
        });
        mailRegistorMock.execute.mockResolvedValue(ok(true));
        expect(isErr(val)).toBe(false);
      });
    });

    describe('invite free', () => {
      beforeEach(() => {
        policy.requireInviteCode.mockResolvedValue(ok(false));
        policy.requireCaptcha.mockResolvedValue(ok(true));
      });

      it('invalid captcha', async () => {
        captcha.verify.mockResolvedValue(ok(false));
        const val = await account.createAccount({
          username: '',
          ident_type: 'email',
          ident_value: 'test@no-reply.com',
          cert_type: '',
          cert_value: '',
          captcha: 'example',
        });
        expect(isErr(val)).toBe(true);
        expect(unwrapErr(val)).toBeInstanceOf(InvalidCaptcha);
      });

      it('valid captcha', async () => {
        captcha.verify.mockResolvedValue(ok(true));
        const val = await account.createAccount({
          username: '',
          ident_type: 'email',
          ident_value: 'test@no-reply.com',
          cert_type: '',
          cert_value: '',
          captcha: 'test',
        });
        mailRegistorMock.execute.mockResolvedValue(ok(true));
        expect(isErr(val)).toBe(false);
      });
    });
  });
});
