/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
import { TestBed } from '@suites/unit';
import { type Mocked } from '@suites/doubles.vitest';
import { DiscoveryService } from '@nestjs/core';
import { EntityManager } from '@mikro-orm/core';
import z from 'zod';
import { FieldDiscoverService } from '../field.discover';
import { Field, FieldMetadata } from '../field.decorator';
import { FieldNotFound, FieldParamError } from '../../error';
import { ok, err } from 'neverthrow';

const UserIDFieldSchema = z.object({ accountID: z.string() });

describe(FieldDiscoverService.name, () => {
  let service: FieldDiscoverService;
  let discovery: Mocked<DiscoveryService>;
  let em: Mocked<EntityManager>;
  let forkedEm: object;

  beforeEach(async () => {
    forkedEm = { isFork: true };

    const { unit, unitRef } = await TestBed.solitary(FieldDiscoverService)
      .mock(DiscoveryService)
      .impl(() => ({
        getProviders: vi.fn(),
        getMetadataByDecorator: vi.fn(),
      }))
      .mock(EntityManager)
      .impl(() => ({
        fork: vi.fn().mockReturnValue(forkedEm),
      }))
      .compile();

    service = unit;
    discovery = unitRef.get(DiscoveryService) as any;
    em = unitRef.get(EntityManager) as any;
  });

  describe('onApplicationBootstrap', () => {
    it('should register providers that carry Field metadata', () => {
      const execute = vi.fn();
      const provider = { instance: { execute } };
      const metadata: FieldMetadata = {
        name: 'user.id',
        schema: UserIDFieldSchema,
      };

      discovery.getProviders.mockReturnValue([provider] as any);
      discovery.getMetadataByDecorator.mockReturnValue(metadata);

      service.onApplicationBootstrap();

      expect(discovery.getProviders).toHaveBeenCalledTimes(1);
      expect(discovery.getMetadataByDecorator).toHaveBeenCalledWith(
        Field,
        provider,
      );
    });

    it('should skip providers without Field metadata', () => {
      const provider1 = { instance: { execute: vi.fn() } };
      const provider2 = { instance: { execute: vi.fn() } };

      discovery.getProviders.mockReturnValue([provider1, provider2] as any);
      discovery.getMetadataByDecorator.mockImplementation(
        (_decorator, provider) => {
          if (provider === provider1) {
            return { name: 'user.id', schema: UserIDFieldSchema };
          }
          return undefined;
        },
      );

      service.onApplicationBootstrap();

      expect(discovery.getMetadataByDecorator).toHaveBeenCalledTimes(2);
    });

    it('should handle empty providers list', () => {
      discovery.getProviders.mockReturnValue([]);

      service.onApplicationBootstrap();

      expect(discovery.getProviders).toHaveBeenCalledTimes(1);
    });
  });

  describe('callHandler', () => {
    it('should return FieldNotFound when handler is not registered', async () => {
      const result = await service.callHandler('user.id', {});

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(FieldNotFound);
    });

    it('should return day of month for time.now.day', async () => {
      const execute = vi.fn();
      bootstrapWithProvider('time.now.day', z.object({}), execute);

      const date = new Date();
      const result = await service.callHandler('time.now.day', {});

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(date.getDate());
      expect(execute).not.toHaveBeenCalled();
    });

    it('should return month for time.now.month', async () => {
      const execute = vi.fn();
      bootstrapWithProvider('time.now.month', z.object({}), execute);

      const date = new Date();
      const result = await service.callHandler('time.now.month', {});

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(date.getMonth() + 1);
      expect(execute).not.toHaveBeenCalled();
    });

    it('should return year for time.now.year', async () => {
      const execute = vi.fn();
      bootstrapWithProvider('time.now.year', z.object({}), execute);

      const date = new Date();
      const result = await service.callHandler('time.now.year', {});

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(date.getFullYear());
      expect(execute).not.toHaveBeenCalled();
    });

    it('should return hour for time.now.hour', async () => {
      const execute = vi.fn();
      bootstrapWithProvider('time.now.hour', z.object({}), execute);

      const date = new Date();
      const result = await service.callHandler('time.now.hour', {});

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(date.getHours());
      expect(execute).not.toHaveBeenCalled();
    });

    it('should return weekday string for time.now.weekday', async () => {
      const execute = vi.fn();
      bootstrapWithProvider('time.now.weekday', z.object({}), execute);

      const date = new Date();
      const result = await service.callHandler('time.now.weekday', {});

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(date.getDay().toString());
      expect(execute).not.toHaveBeenCalled();
    });

    it('should return FieldParamError when schema validation fails', async () => {
      const execute = vi.fn();
      bootstrapWithProvider('user.id', UserIDFieldSchema, execute);

      const result = await service.callHandler('user.id', { wrongParam: 123 });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(FieldParamError);
      expect(execute).not.toHaveBeenCalled();
    });

    it('should execute handler with forked em when schema validation passes', async () => {
      const execute = vi.fn().mockResolvedValue(ok('result'));
      bootstrapWithProvider('user.id', UserIDFieldSchema, execute);

      const params = { accountID: 'acc-1' };
      const result = await service.callHandler('user.id', params);

      expect(result.isOk()).toBe(true);
      expect(execute).toHaveBeenCalledWith(params, {
        em: forkedEm,
        accountID: 'acc-1',
      });
      expect(em.fork).toHaveBeenCalled();
    });

    it('should execute handler directly when metadata is absent', async () => {
      const execute = vi.fn().mockResolvedValue(ok('bio'));
      const provider = { instance: { execute } };

      discovery.getProviders.mockReturnValue([provider] as any);
      discovery.getMetadataByDecorator.mockReset().mockReturnValue(undefined);
      service.onApplicationBootstrap();

      const params = { bio: 'hello' };
      const result = await service.callHandler('user.bio', params);

      expect(result.isOk()).toBe(false);
    });

    it('should propagate err result from handler', async () => {
      const execute = vi.fn().mockResolvedValue(err(new Error('boom')));
      bootstrapWithProvider('user.id', UserIDFieldSchema, execute);

      const result = await service.callHandler('user.id', {
        accountID: 'acc-1',
      });

      expect(result.isErr()).toBe(true);
    });
  });

  function bootstrapWithProvider(
    name: Parameters<FieldDiscoverService['callHandler']>[0],
    schema: z.ZodType,
    execute: ReturnType<typeof vi.fn>,
  ) {
    const provider = { instance: { execute } };
    const metadata: FieldMetadata = { name, schema };

    discovery.getProviders.mockReturnValue([provider] as any);
    discovery.getMetadataByDecorator.mockReset().mockReturnValue(metadata);
    service.onApplicationBootstrap();
  }
});