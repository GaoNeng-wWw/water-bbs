import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowRunner } from '../domain';
import {
  ACTION_HANDLER,
  IActionHandler,
} from '../domain/action-handler.interface';
import { vi } from 'vitest';
import { DomainError, err, isErr, ok } from 'water-bbs-shared';
import { ValidateFailError } from '../errors/validate-fail';
import { CanNotFoundHandlerError } from '../errors/can-not-found-handler';

class MockError extends DomainError {
  constructor() {
    super('Mock_ERROR');
  }
}

describe('WorkflowRunner', () => {
  let service: WorkflowRunner;

  const mockAction: IActionHandler = {
    name: 'mock',
    validate: vi.fn(),
    run: vi.fn().mockReturnValue(ok(true)),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowRunner,
        {
          provide: ACTION_HANDLER,
          useValue: [mockAction],
        },
      ],
    }).compile();

    service = module.get<WorkflowRunner>(WorkflowRunner);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Validate Fail', async () => {
    mockAction.validate = vi.fn().mockReturnValue({
      ok: false,
      error: new MockError(),
    });
    const res = await service.execute({
      type: 'mock',
      args: {},
      children: [],
    });
    expect(isErr(res)).toBe(true);
    if (isErr(res)) {
      expect(res.error).toBeInstanceOf(ValidateFailError);
    }
  });
  it('Can not found handler', async () => {
    mockAction.validate = vi.fn().mockReturnValue({
      ok: true,
      error: null,
    });
    const res = await service.execute({
      type: 'not-found',
      args: {},
      children: [],
    });
    expect(isErr(res)).toBe(true);
    if (isErr(res)) {
      expect(res.error).toBeInstanceOf(CanNotFoundHandlerError);
    }
  });
  it('Run', async () => {
    mockAction.validate = vi.fn().mockReturnValue({
      ok: true,
      error: null,
    });
    const res = await service.execute({
      type: 'mock',
      args: {},
      children: [],
    });
    expect(isErr(res)).toBe(false);
  });

  it('Execute with children actions', async () => {
    mockAction.validate = vi.fn().mockReturnValue({
      ok: true,
      error: null,
    });
    mockAction.run = vi
      .fn()
      .mockResolvedValueOnce({ result: 'parent' })
      .mockResolvedValueOnce({ result: 'child' });

    const res = await service.execute({
      type: 'mock',
      args: {},
      children: [
        {
          type: 'mock',
          args: {},
          children: [],
        },
      ],
    });

    expect(isErr(res)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockAction.run).toHaveBeenCalledTimes(2);
  });

  it('Execute with children actions - child fails', async () => {
    mockAction.validate = vi.fn().mockReturnValue({
      ok: true,
      error: null,
    });
    mockAction.run = vi.fn().mockResolvedValueOnce(err(new MockError()));

    const res = await service.execute({
      type: 'mock',
      args: {},
      children: [
        {
          type: 'mock',
          args: {},
          children: [],
        },
      ],
    });

    expect(isErr(res)).toBe(true);
  });

  it('Execute with parameter passing', async () => {
    mockAction.validate = vi.fn().mockReturnValue({
      ok: true,
      error: null,
    });
    const testParam = { test: 'value' };
    mockAction.run = vi.fn().mockResolvedValue({ result: 'executed' });

    const res = await service.execute(
      {
        type: 'mock',
        args: {},
        children: [],
      },
      testParam,
    );

    expect(isErr(res)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockAction.run).toHaveBeenCalledWith(testParam);
  });

  it('Execute with multiple handlers', async () => {
    const mockAction2 = {
      name: 'mock2',
      validate: vi.fn().mockReturnValue({
        ok: true,
        error: null,
      }),
      run: vi.fn().mockResolvedValue({ result: 'handler2' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowRunner,
        {
          provide: ACTION_HANDLER,
          useValue: [mockAction, mockAction2],
        },
      ],
    }).compile();

    const service2 = module.get<WorkflowRunner>(WorkflowRunner);

    const res = await service2.execute({
      type: 'mock2',
      args: {},
      children: [],
    });

    expect(isErr(res)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockAction2.run).toHaveBeenCalled();
  });

  it('Execute with nested children', async () => {
    mockAction.validate = vi.fn().mockReturnValue({
      ok: true,
      error: null,
    });
    mockAction.run = vi
      .fn()
      .mockResolvedValueOnce({ result: 'level1' })
      .mockResolvedValueOnce({ result: 'level2' })
      .mockResolvedValueOnce({ result: 'level3' });

    const res = await service.execute({
      type: 'mock',
      args: {},
      children: [
        {
          type: 'mock',
          args: {},
          children: [
            {
              type: 'mock',
              args: {},
              children: [],
            },
          ],
        },
      ],
    });

    expect(isErr(res)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockAction.run).toHaveBeenCalledTimes(3);
  });
});
