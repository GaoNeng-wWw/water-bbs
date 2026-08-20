/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Logger } from '@nestjs/common';
import { Engine } from 'json-rules-engine';
import { ResolverHandlerMetadata } from '../resolver.decorator';
import { ResolverDiscoverService } from '../resolver-discover.service';

describe(ResolverDiscoverService.name, () => {
  let service: ResolverDiscoverService;
  let getProviders: ReturnType<typeof vi.fn>;
  let getMetadataByDecorator: ReturnType<typeof vi.fn>;
  let addFact: ReturnType<typeof vi.fn>;
  let em: Record<string, unknown>;
  let loggerLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getProviders = vi.fn();
    getMetadataByDecorator = vi.fn();
    addFact = vi.fn();
    em = {};

    service = new ResolverDiscoverService(
      { getProviders, getMetadataByDecorator } as any,
      { addFact } as unknown as Engine,
      em as any,
    );

    loggerLogSpy = vi
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(vi.fn());
  });

  afterEach(() => {
    loggerLogSpy.mockRestore();
  });

  it('should discover providers with ResolverHandlerMetadata and register as facts', () => {
    const handle = vi.fn();
    const metadata = { key: 'user-exists' };

    getProviders.mockReturnValue([{ instance: handle }]);
    getMetadataByDecorator.mockReturnValue(metadata);

    service.onApplicationBootstrap();

    expect(loggerLogSpy).toHaveBeenCalledWith('user-exists discovered');
    expect(addFact).toHaveBeenCalledWith('user-exists', expect.any(Function));
  });

  it('should skip providers without ResolverHandlerMetadata', () => {
    getProviders.mockReturnValue([{ instance: {} }]);
    getMetadataByDecorator.mockReturnValue(undefined);

    service.onApplicationBootstrap();

    expect(addFact).not.toHaveBeenCalled();
    expect(loggerLogSpy).not.toHaveBeenCalled();
  });

  it('should call handler with param and context when fact is evaluated', async () => {
    const handle = vi.fn();
    const metadata = { key: 'check-permission' };

    getProviders.mockReturnValue([{ instance: handle }]);
    getMetadataByDecorator.mockReturnValue(metadata);

    service.onApplicationBootstrap();

    const factFn = addFact.mock.calls[0][1];
    const param = { userId: '123' };
    await factFn(param);

    expect(handle).toHaveBeenCalledWith(param, { em, events: [] });
  });

  it('should discover multiple providers', () => {
    const handle1 = vi.fn();
    const handle2 = vi.fn();

    getProviders.mockReturnValue([
      { instance: handle1 },
      { instance: handle2 },
    ]);
    getMetadataByDecorator
      .mockReturnValueOnce({ key: 'resolver-a' })
      .mockReturnValueOnce({ key: 'resolver-b' });

    service.onApplicationBootstrap();

    expect(addFact).toHaveBeenCalledTimes(2);
    expect(addFact).toHaveBeenCalledWith('resolver-a', expect.any(Function));
    expect(addFact).toHaveBeenCalledWith('resolver-b', expect.any(Function));
    expect(loggerLogSpy).toHaveBeenCalledWith('resolver-a discovered');
    expect(loggerLogSpy).toHaveBeenCalledWith('resolver-b discovered');
  });

  it('should skip providers without metadata while keeping others', () => {
    const handle1 = vi.fn();
    const handle2 = vi.fn();

    getProviders.mockReturnValue([
      { instance: handle1 },
      { instance: handle2 },
    ]);
    getMetadataByDecorator
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce({ key: 'resolver-b' });

    service.onApplicationBootstrap();

    expect(addFact).toHaveBeenCalledTimes(1);
    expect(addFact).toHaveBeenCalledWith('resolver-b', expect.any(Function));
    expect(loggerLogSpy).not.toHaveBeenCalledWith('resolver-a discovered');
    expect(loggerLogSpy).toHaveBeenCalledWith('resolver-b discovered');
  });

  it('should pass getMetadataByDecorator the ResolverHandlerMetadata token', () => {
    getProviders.mockReturnValue([]);

    service.onApplicationBootstrap();

    expect(getMetadataByDecorator).not.toHaveBeenCalled();
  });

  it('should call getMetadataByDecorator with ResolverHandlerMetadata for each provider', () => {
    const handle1 = vi.fn();
    const handle2 = vi.fn();
    const provider1 = { instance: handle1 };
    const provider2 = { instance: handle2 };

    getProviders.mockReturnValue([provider1, provider2]);
    getMetadataByDecorator.mockReturnValue(undefined);

    service.onApplicationBootstrap();

    expect(getMetadataByDecorator).toHaveBeenCalledTimes(2);
    expect(getMetadataByDecorator).toHaveBeenCalledWith(
      ResolverHandlerMetadata,
      provider1,
    );
    expect(getMetadataByDecorator).toHaveBeenCalledWith(
      ResolverHandlerMetadata,
      provider2,
    );
  });
});
