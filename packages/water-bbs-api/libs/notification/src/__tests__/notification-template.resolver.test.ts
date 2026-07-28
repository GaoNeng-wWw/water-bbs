import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationTemplateResolver } from '../notification-template.resolver';
import { NotFoundTemplate } from '../error';
import { NotificationChannel } from '../notification.service';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

vi.mock('path', () => ({
  join: vi.fn((...args) => args.join('/')),
}));

import { readFileSync } from 'fs';

describe('NotificationTemplateResolver', () => {
  let resolver: NotificationTemplateResolver;

  beforeEach(() => {
    vi.clearAllMocks();
    resolver = new NotificationTemplateResolver();
  });

  it('should resolve template and render data', () => {
    vi.mocked(readFileSync).mockReturnValue(Buffer.from('Hello <%= name %>'));

    const result = resolver.resolve(NotificationChannel.EMAIL, 'welcome', {
      name: 'Jack',
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(result.value).toBe('Hello Jack');
    }

    expect(readFileSync).toHaveBeenCalledTimes(1);
  });

  it('should use channel as template name when name is undefined', () => {
    vi.mocked(readFileSync).mockReturnValue(Buffer.from('Code: <%= code %>'));

    const result = resolver.resolve(NotificationChannel.EMAIL, undefined, {
      code: '123456',
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(result.value).toBe('Code: 123456');
    }

    expect(readFileSync).toHaveBeenCalledWith(
      expect.stringContaining(
        `${NotificationChannel.EMAIL}.${NotificationChannel.EMAIL}.ejs`,
      ),
    );
  });

  it('should use cache after first resolve', () => {
    vi.mocked(readFileSync).mockReturnValue(Buffer.from('Hello'));

    const first = resolver.resolve(NotificationChannel.EMAIL, 'test');

    const second = resolver.resolve(NotificationChannel.EMAIL, 'test');

    expect(first.isOk()).toBe(true);
    expect(second.isOk()).toBe(true);

    expect(readFileSync).toHaveBeenCalledTimes(1);
  });

  it('should return NotFoundTemplate when file not exists', () => {
    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const result = resolver.resolve(NotificationChannel.EMAIL, 'missing');

    expect(result.isErr()).toBe(true);

    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(NotFoundTemplate);
    }
  });
});
