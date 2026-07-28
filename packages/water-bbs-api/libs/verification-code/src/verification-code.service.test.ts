/* eslint-disable @typescript-eslint/unbound-method */
import { TestBed } from '@suites/unit';
import { type Mocked } from '@suites/doubles.vitest';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConfigureService } from '@app/configure';
import { VerificationCodeService } from './verification-code.service';
import { CodeNotFoundOrExpired, RepeatSend } from './verification-code.error';
import Redis from 'ioredis';

describe(VerificationCodeService.name, () => {
  let service: VerificationCodeService;
  let redis: Mocked<RedisService>;
  let cfg: Mocked<ConfigureService>;
  let redisClient: Mocked<Redis>;

  beforeEach(async () => {
    redisClient = {
      exists: vi.fn(),
      set: vi.fn(),
      get: vi.fn(),
    } as any;

    const { unit, unitRef } = await TestBed.solitary(VerificationCodeService)
      .mock(RedisService)
      .impl(() => {
        return {
          getOrThrow: vi.fn().mockReturnValue(redisClient),
        };
      })
      .compile();
    service = unit;
    redis = unitRef.get(RedisService) as any;
    cfg = unitRef.get(ConfigureService) as any;
    redisClient = redis.getOrThrow() as any;
  });

  describe('issue', () => {
    it('should generate and save verification code', async () => {
      cfg.get.mockReturnValue(300);

      redisClient.exists.mockResolvedValue(0);
      redisClient.set.mockResolvedValue('OK');

      const result = await service.issue({
        scene: 'email',
        receiver: 'test@example.com',
      });

      expect(result.isOk()).toBe(true);

      const code = result._unsafeUnwrap();

      expect(code).toHaveLength(8);

      expect(cfg.get).toHaveBeenCalledWith('feature.verificationCodeTTL');

      expect(redisClient.exists).toHaveBeenCalledWith(
        'verification:email:test@example.com',
      );

      expect(redisClient.set).toHaveBeenCalledWith(
        'verification:email:test@example.com',
        code,
        'EX',
        300,
      );
    });

    it('should return RepeatSend when verification code exists', async () => {
      redisClient.exists.mockResolvedValue(1);

      const result = await service.issue({
        scene: 'email',
        receiver: 'test@example.com',
      });

      expect(result.isErr()).toBe(true);

      expect(result._unsafeUnwrapErr()).toBeInstanceOf(RepeatSend);

      expect(redisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('verify', () => {
    it('should return ok when code matches', async () => {
      redisClient.get.mockResolvedValue('ABC12345');

      const result = await service.verify({
        scene: 'email',
        receiver: 'test@example.com',
        code: 'ABC12345',
      });

      expect(result.isOk()).toBe(true);

      expect(redisClient.get).toHaveBeenCalledWith(
        'verification:email:test@example.com',
      );
    });

    it('should return CodeNotFoundOrExpired when code expired', async () => {
      redisClient.get.mockResolvedValue(null);

      const result = await service.verify({
        scene: 'email',
        receiver: 'test@example.com',
        code: 'ABC12345',
      });

      expect(result.isErr()).toBe(true);

      expect(result._unsafeUnwrapErr()).toBeInstanceOf(CodeNotFoundOrExpired);
    });

    it('should return CodeNotFoundOrExpired when code mismatch', async () => {
      redisClient.get.mockResolvedValue('REALCODE');

      const result = await service.verify({
        scene: 'email',
        receiver: 'test@example.com',
        code: 'WRONGCODE',
      });

      expect(result.isErr()).toBe(true);

      expect(result._unsafeUnwrapErr()).toBeInstanceOf(CodeNotFoundOrExpired);
    });
  });
});
