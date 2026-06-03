/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from '../workflow.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { vi } from 'vitest';
import { Action } from 'water-bbs-migration';
import Redis from 'ioredis';
import { z } from 'zod';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let mockRedis: Redis;
  let mockActionRepo: EntityRepository<Action>;

  beforeEach(async () => {
    mockRedis = {
      get: vi.fn(),
      set: vi.fn(),
    } as any;

    mockActionRepo = {
      find: vi.fn(),
      insert: vi.fn(),
    } as any;

    const mockRedisService = {
      getOrThrow: vi.fn().mockReturnValue(mockRedis),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        {
          provide: getRepositoryToken(Action),
          useValue: mockActionRepo,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    const mockSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    it('should return early if action exists in Redis', async () => {
      mockRedis.get = vi.fn().mockResolvedValue('1');
      mockRedis.set = vi.fn();
      mockActionRepo.find = vi.fn();
      mockActionRepo.insert = vi.fn();

      await service.save('test-action', mockSchema);

      expect(mockRedis.get).toHaveBeenCalledWith('action:test-action');
      expect(mockRedis.set).not.toHaveBeenCalled();
      expect(mockActionRepo.find).not.toHaveBeenCalled();
      expect(mockActionRepo.insert).not.toHaveBeenCalled();
    });

    it('should set Redis cache and return if action exists in database', async () => {
      const mockAction = { id: 1, name: 'test-action' };
      mockRedis.get = vi.fn().mockResolvedValue(null);
      mockRedis.set = vi.fn();
      mockActionRepo.find = vi.fn().mockResolvedValue(mockAction);
      mockActionRepo.insert = vi.fn();

      await service.save('test-action', mockSchema);

      expect(mockRedis.get).toHaveBeenCalledWith('action:test-action');
      expect(mockRedis.set).toHaveBeenCalledWith(
        'action:test-action',
        '1',
        'EX',
        60,
      );
      expect(mockActionRepo.find).toHaveBeenCalledWith({ name: 'test-action' });
      expect(mockActionRepo.insert).not.toHaveBeenCalled();
    });

    it('should insert new action if not in Redis or database', async () => {
      mockRedis.get = vi.fn().mockResolvedValue(null);
      mockRedis.set = vi.fn();
      mockActionRepo.find = vi.fn().mockResolvedValue(null);
      mockActionRepo.insert = vi.fn();

      await service.save('test-action', mockSchema);

      expect(mockRedis.get).toHaveBeenCalledWith('action:test-action');
      expect(mockRedis.set).toHaveBeenCalledWith(
        'action:test-action',
        '1',
        'EX',
        60,
      );
      expect(mockActionRepo.find).toHaveBeenCalledWith({ name: 'test-action' });
      expect(mockActionRepo.insert).toHaveBeenCalled();
    });

    it('should handle database find error gracefully', async () => {
      mockRedis.get = vi.fn().mockResolvedValue(null);
      mockRedis.set = vi.fn();
      mockActionRepo.find = vi
        .fn()
        .mockRejectedValue(new Error('Database error'));
      mockActionRepo.insert = vi.fn();

      await expect(
        service.save('test-action', mockSchema),
      ).resolves.toBeUndefined();

      expect(mockRedis.get).toHaveBeenCalledWith('action:test-action');
      expect(mockRedis.set).toHaveBeenCalledWith(
        'action:test-action',
        '1',
        'EX',
        60,
      );
      expect(mockActionRepo.find).toHaveBeenCalledWith({ name: 'test-action' });
      expect(mockActionRepo.insert).not.toHaveBeenCalled();
    });

    it('should handle database insert error gracefully', async () => {
      mockRedis.get = vi.fn().mockResolvedValue(null);
      mockRedis.set = vi.fn();
      mockActionRepo.find = vi.fn().mockResolvedValue(null);
      mockActionRepo.insert = vi
        .fn()
        .mockRejectedValue(new Error('Insert error'));

      await expect(
        service.save('test-action', mockSchema),
      ).resolves.toBeUndefined();

      expect(mockRedis.get).toHaveBeenCalledWith('action:test-action');
      expect(mockRedis.set).toHaveBeenCalledWith(
        'action:test-action',
        '1',
        'EX',
        60,
      );
      expect(mockActionRepo.find).toHaveBeenCalledWith({ name: 'test-action' });
      expect(mockActionRepo.insert).toHaveBeenCalled();
    });

    it('should convert schema to JSON format before insertion', async () => {
      const complexSchema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        age: z.number().min(18),
      });

      mockRedis.get = vi.fn().mockResolvedValue(null);
      mockRedis.set = vi.fn();
      mockActionRepo.find = vi.fn().mockResolvedValue(null);
      mockActionRepo.insert = vi.fn();

      await service.save('user-action', complexSchema);

      expect(mockActionRepo.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'user-action',
        }),
      );
    });
  });
});
