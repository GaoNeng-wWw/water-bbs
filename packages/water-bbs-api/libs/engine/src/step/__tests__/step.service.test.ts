import z from 'zod';
import { StepDiscoverService } from '../step.discover-service';
import { Step, StepDefinition } from '../step.decorator';
import { StepNotFound } from '../error';

@Step({
  name: 'testStep',
  inputSchema: z.object({ name: z.string() }),
  uiSchema: {
    type: 'text',
    name: 'name',
    label: 'Name',
  } as StepDefinition<unknown>['uiSchema'],
  description: 'A test step',
})
class TestStep {
  run(param: { name: string }) {
    return `Hello, ${param.name}!`;
  }
}

@Step({
  name: 'asyncStep',
  inputSchema: z.object({ value: z.number() }),
  uiSchema: {
    type: 'number',
    name: 'value',
    label: 'Value',
  } as StepDefinition<unknown>['uiSchema'],
})
class AsyncStep {
  // eslint-disable-next-line @typescript-eslint/require-await
  async run(param: { value: number }) {
    return { doubled: param.value * 2 };
  }
}

describe(StepDiscoverService.name, () => {
  let map: Map<any, any>;
  let discovery: { getProviders: ReturnType<typeof vi.fn> };
  let reflector: { get: ReturnType<typeof vi.fn> };
  let service: StepDiscoverService;

  beforeEach(() => {
    map = new Map();
    discovery = { getProviders: vi.fn() };
    reflector = { get: vi.fn() };
    service = new StepDiscoverService(map, discovery as any, reflector as any);
  });

  describe('onApplicationBootstrap', () => {
    it('should collect steps from discovered providers', () => {
      const handler = new TestStep();
      const definition: StepDefinition<unknown> = {
        name: 'testStep',
        inputSchema: z.object({ name: z.string() }),
        uiSchema: {
          type: 'text',
          name: 'name',
          label: 'Name',
        } as StepDefinition<unknown>['uiSchema'],
      };

      discovery.getProviders.mockReturnValue([
        { metatype: TestStep, instance: handler },
        { metatype: null, instance: {} },
      ]);

      reflector.get.mockImplementation((_key: symbol, metatype: unknown) => {
        if (metatype === TestStep) {
          return definition;
        }
        return undefined;
      });

      service.onApplicationBootstrap();

      expect(map.size).toBe(1);
      expect(map.get(TestStep)).toEqual({
        definition,
        handler,
      });
    });

    it('should skip providers without StepKey metadata', () => {
      class NotAStep {}

      discovery.getProviders.mockReturnValue([
        { metatype: NotAStep, instance: new NotAStep() },
      ]);

      reflector.get.mockReturnValue(undefined);

      service.onApplicationBootstrap();

      expect(map.size).toBe(0);
    });

    it('should skip providers with null metatype', () => {
      discovery.getProviders.mockReturnValue([
        { metatype: null, instance: {} },
      ]);

      service.onApplicationBootstrap();

      expect(map.size).toBe(0);
      expect(reflector.get).not.toHaveBeenCalled();
    });
  });

  describe('call', () => {
    it('should return StepNotFound when step is not registered', () => {
      const result = service.call(TestStep, { name: 'test' });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(StepNotFound);
    });

    it('should return ok result for valid sync step call', () => {
      const handler = new TestStep();
      map.set(TestStep, {
        definition: {
          name: 'testStep',
          inputSchema: z.object({ name: z.string() }),
          uiSchema: {
            type: 'text',
            name: 'name',
            label: 'Name',
          } as StepDefinition<unknown>['uiSchema'],
        },
        handler,
      });

      const result = service.call(TestStep, { name: 'World' });

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe('Hello, World!');
    });

    it('should return ok wrapping a promise for async step call', async () => {
      const handler = new AsyncStep();
      map.set(AsyncStep, {
        definition: {
          name: 'asyncStep',
          inputSchema: z.object({ value: z.number() }),
          uiSchema: {
            type: 'number',
            name: 'value',
            label: 'Value',
          } as StepDefinition<unknown>['uiSchema'],
        },
        handler,
      });

      const result = service.call(AsyncStep, { value: 5 });

      expect(result.isOk()).toBe(true);
      const inner = result._unsafeUnwrap();
      expect(inner).toBeInstanceOf(Promise);
      await expect(inner).resolves.toEqual({ doubled: 10 });
    });
  });
});
