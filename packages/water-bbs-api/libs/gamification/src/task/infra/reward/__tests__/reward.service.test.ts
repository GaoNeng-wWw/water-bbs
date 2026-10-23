/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
import { DiscoveryService } from '@nestjs/core';
import { EntityManager } from '@mikro-orm/core';
import { err, ok } from 'neverthrow';
import { z } from 'zod';
import { RewardService } from '../reward.service';
import { IReward, RewardMetadata } from '../reward.decorator';
import { RewardNotFound } from '../../error';
import { RewardParamError } from '../../error/reward-param-error';
import { InfraError } from '@app/shared';

describe('RewardService', () => {
  let service: RewardService;
  let discoveryService: {
    getProviders: ReturnType<typeof vi.fn>;
    getMetadataByDecorator: ReturnType<typeof vi.fn>;
  };
  let em: { fork: ReturnType<typeof vi.fn> };

  const schema = z.object({ amount: z.number() });
  const metadata: RewardMetadata = { name: 'coin-reward', schema };
  const fakeReward: IReward<typeof schema, { applied: boolean }> = {
    execute: vi.fn(),
  };

  beforeEach(() => {
    discoveryService = {
      getProviders: vi.fn(),
      getMetadataByDecorator: vi.fn(),
    };
    em = { fork: vi.fn() };
    fakeReward.execute['mockReset']();
    service = new RewardService(
      discoveryService as unknown as DiscoveryService,
      em as unknown as EntityManager,
    );
  });

  function registerReward() {
    discoveryService.getProviders.mockReturnValue([{ instance: fakeReward }]);
    discoveryService.getMetadataByDecorator.mockReturnValue(metadata);
    service.onApplicationBootstrap();
  }

  /** Stubs the single em.fork() call (write) and runs a successful call. */
  async function runReward(param: Record<string, unknown> = { amount: 10 }) {
    const writeEm = {
      marker: 'write',
      // Simulate a transactional wrapper that forwards the write EM to the cb.
      transactional: vi.fn((cb: (em: unknown) => unknown) => cb(writeEm)),
    };
    em.fork.mockReturnValue(writeEm);
    const result = await service.call('coin-reward', param);
    return { writeEm, result };
  }

  describe('onApplicationBootstrap', () => {
    it('registers rewards and skips providers without metadata', async () => {
      discoveryService.getProviders.mockReturnValue([
        { instance: fakeReward },
        { instance: fakeReward },
      ]);
      discoveryService.getMetadataByDecorator
        .mockReturnValueOnce(metadata)
        .mockReturnValueOnce(undefined);
      fakeReward.execute['mockResolvedValue'](ok({ applied: true }));

      service.onApplicationBootstrap();

      const { result } = await runReward();
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ applied: true });
      expect(fakeReward.execute).toHaveBeenCalledTimes(1);
    });

    it('handles the case with no providers', () => {
      discoveryService.getProviders.mockReturnValue([]);
      service.onApplicationBootstrap();
    });
  });

  describe('call', () => {
    it('returns RewardNotFound when the reward is not registered', async () => {
      const result = await service.call('unknown', {});

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(RewardNotFound);
    });

    it('returns RewardParamError when the param fails schema validation', async () => {
      registerReward();

      const { result } = await runReward({ amount: 'invalid' });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(RewardParamError);
      expect(fakeReward.execute).not.toHaveBeenCalled();
    });

    it('returns RewardNotFound when the registered instance is missing', async () => {
      discoveryService.getProviders.mockReturnValue([]);
      discoveryService.getMetadataByDecorator.mockReturnValue(metadata);
      // A provider without an instance registers metadata but no instanceMap entry.
      service.onApplicationBootstrap();

      const result = await service.call('coin-reward', { amount: 10 });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(RewardNotFound);
    });

    it('executes the reward with parsed data inside a transaction on success', async () => {
      fakeReward.execute['mockResolvedValue'](ok({ applied: true }));
      registerReward();

      const { writeEm, result } = await runReward();

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ applied: true });
      expect(em.fork).toHaveBeenCalledTimes(1);
      expect(writeEm.transactional).toHaveBeenCalledTimes(1);
      expect(fakeReward.execute).toHaveBeenCalledWith(
        { amount: 10 },
        { read: writeEm, write: writeEm },
      );
    });

    it('returns the error when the reward execution fails', async () => {
      const reason = new Error('boom');
      fakeReward.execute['mockResolvedValue'](err(reason));
      registerReward();

      const { result } = await runReward();
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(InfraError);
    });
  });
});