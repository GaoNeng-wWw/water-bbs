/* eslint-disable @typescript-eslint/require-await */
import z from 'zod';
import {
  ResolverRegistry,
  Resolver,
  ResolverDefinition,
} from '../resolver-registry';
import { ResolverNotFound, BadValid } from '../error';

@Resolver({
  name: 'testResolver',
  inputSchema: z.object({ name: z.string() }),
  uiSchema: {
    type: 'text',
    name: 'name',
    label: 'Name',
  } as ResolverDefinition['uiSchema'],
  description: 'A test resolver',
})
class TestResolver {
  run(param: { name: string }) {
    return `Hello, ${param.name}!`;
  }
}

@Resolver({
  name: 'asyncResolver',
  inputSchema: z.object({ value: z.number().min(1) }),
  uiSchema: {
    type: 'number',
    name: 'value',
    label: 'Value',
  } as ResolverDefinition['uiSchema'],
})
class AsyncResolver {
  async run(param: { value: number }) {
    return { doubled: param.value * 2 };
  }
}

describe(ResolverRegistry.name, () => {
  let map: Map<any, any>;
  let discovery: { getProviders: ReturnType<typeof vi.fn> };
  let reflector: { get: ReturnType<typeof vi.fn> };
  let registry: ResolverRegistry;

  beforeEach(() => {
    map = new Map();
    discovery = { getProviders: vi.fn() };
    reflector = { get: vi.fn() };
    registry = new ResolverRegistry(map, discovery as any, reflector as any);
  });

  describe('onApplicationBootstrap', () => {
    it('should collect resolvers from discovered providers', () => {
      const handler = new TestResolver();
      const definition: ResolverDefinition = {
        name: 'testResolver',
        inputSchema: z.object({ name: z.string() }),
        uiSchema: {
          type: 'text',
          name: 'name',
          label: 'Name',
        } as ResolverDefinition['uiSchema'],
      };

      discovery.getProviders.mockReturnValue([
        { metatype: TestResolver, instance: handler },
        { metatype: null, instance: {} },
      ]);

      reflector.get.mockImplementation((_key: symbol, metatype: unknown) => {
        if (metatype === TestResolver) {
          return definition;
        }
        return undefined;
      });

      registry.onApplicationBootstrap();

      expect(map.size).toBe(1);
      expect(map.get(TestResolver)).toEqual({
        definition,
        handler,
      });
    });

    it('should skip providers without RESOLVER_KEY metadata', () => {
      class NotAResolver {}

      discovery.getProviders.mockReturnValue([
        { metatype: NotAResolver, instance: new NotAResolver() },
      ]);

      reflector.get.mockReturnValue(undefined);

      registry.onApplicationBootstrap();

      expect(map.size).toBe(0);
    });

    it('should skip providers with null metatype', () => {
      discovery.getProviders.mockReturnValue([
        { metatype: null, instance: {} },
      ]);

      registry.onApplicationBootstrap();

      expect(map.size).toBe(0);
      expect(reflector.get).not.toHaveBeenCalled();
    });
  });

  describe('call', () => {
    it('should return ResolverNotFound when resolver is not registered', async () => {
      const result = await registry.call(TestResolver, { name: 'test' });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ResolverNotFound);
    });

    it('should return BadValid when input validation fails', async () => {
      const handler = new TestResolver();
      map.set(TestResolver, {
        definition: {
          name: 'testResolver',
          inputSchema: z.object({ name: z.string() }),
          uiSchema: {
            type: 'text',
            name: 'name',
            label: 'Name',
          } as ResolverDefinition['uiSchema'],
        },
        handler,
      });

      const result = await registry.call(TestResolver, { name: 123 } as any);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(BadValid);
    });

    it('should return ok result for valid sync resolver call', async () => {
      const handler = new TestResolver();
      map.set(TestResolver, {
        definition: {
          name: 'testResolver',
          inputSchema: z.object({ name: z.string() }),
          uiSchema: {
            type: 'text',
            name: 'name',
            label: 'Name',
          } as ResolverDefinition['uiSchema'],
        },
        handler,
      });

      const result = await registry.call(TestResolver, { name: 'World' });

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe('Hello, World!');
    });

    it('should return ok result for valid async resolver call', async () => {
      const handler = new AsyncResolver();
      map.set(AsyncResolver, {
        definition: {
          name: 'asyncResolver',
          inputSchema: z.object({ value: z.number().min(1) }),
          uiSchema: {
            type: 'number',
            name: 'value',
            label: 'Value',
          } as ResolverDefinition['uiSchema'],
        },
        handler,
      });

      const result = await registry.call(AsyncResolver, { value: 5 });

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ doubled: 10 });
    });

    it('should return BadValid when async resolver receives invalid param', async () => {
      const handler = new AsyncResolver();
      map.set(AsyncResolver, {
        definition: {
          name: 'asyncResolver',
          inputSchema: z.object({ value: z.number().min(1) }),
          uiSchema: {
            type: 'number',
            name: 'value',
            label: 'Value',
          } as ResolverDefinition['uiSchema'],
        },
        handler,
      });

      const result = await registry.call(AsyncResolver, { value: 0 });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(BadValid);
    });
  });
});
