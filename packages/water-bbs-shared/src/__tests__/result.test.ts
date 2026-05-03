import { describe, expect, it, vi } from 'vitest';
import { err, isNone, isSome, ok, pipeResult, unwrapOption } from '../option-result'; // 确保实际路径正确

describe('pipeResult', () => {
  it('isOk and isErr work correctly', () => {
    expect(pipeResult(ok(1)).isOk()).toBe(true);
    expect(pipeResult(ok(1)).isErr()).toBe(false);
    expect(pipeResult(err('e')).isOk()).toBe(false);
    expect(pipeResult(err('e')).isErr()).toBe(true);
  });
  it('map transforms Ok value and keeps Ok', () => {
    const res = pipeResult(ok(2)).map(x => x * 10);
    expect(res.isOk()).toBe(true);
    expect(res.unwrap()).toBe(20);
  });

  it('map does not execute on Err', () => {
    const res = pipeResult(err('fail')).map(x => x);
    expect(res.isErr()).toBe(true);
    expect(res.unwrapErr()).toBe('fail');
  });

  it('mapErr transforms Err value and keeps Err', () => {
    const res = pipeResult(err('oops')).mapErr(e => e.toUpperCase());
    expect(res.isErr()).toBe(true);
    expect(res.unwrapErr()).toBe('OOPS');
  });

  it('mapErr does not execute on Ok', () => {
    const res = pipeResult(ok(1)).mapErr(e => `ignored`);
    expect(res.isOk()).toBe(true);
    expect(res.unwrap()).toBe(1);
  });

  it('andThen chains Ok to a new Result', () => {
    const res = pipeResult(ok(3)).andThen(x => ok(x * 2));
    expect(res.unwrap()).toBe(6);
  });

  it('andThen returns the first Err', () => {
    const res = pipeResult(err('first')).andThen(x => ok(x));
    expect(res.isErr()).toBe(true);
    expect(res.unwrapErr()).toBe('first');
  });

  it('or returns the first if Ok', () => {
    const res = pipeResult(ok('a')).or(ok('b'));
    expect(res.unwrap()).toBe('a');
  });

  it('or returns the second if Err', () => {
    const res = pipeResult(err('e1')).or(ok('b'));
    expect(res.unwrap()).toBe('b');
  });

  it('orElse returns Ok if already Ok', () => {
    const fn = vi.fn(() => ok('fallback'));
    const res = pipeResult(ok('original')).orElse(fn);
    expect(res.unwrap()).toBe('original');
    expect(fn).not.toHaveBeenCalled();
  });

  it('orElse calls the function and returns its Result on Err', () => {
    const res = pipeResult(err('bad')).orElse(e => ok(`saved:${e}`));
    expect(res.unwrap()).toBe('saved:bad');
  });

  it('orElse returns Err from the function if it returns Err', () => {
    const res = pipeResult(err('bad')).orElse(() => err('still bad'));
    expect(res.isErr()).toBe(true);
    expect(res.unwrapErr()).toBe('still bad');
  });

  it('ok() returns Some for Ok', () => {
    const opt = pipeResult(ok(42)).ok();
    expect(isSome(opt)).toBe(true);
    expect(unwrapOption(opt)).toBe(42);
  });

  it('ok() returns None for Err', () => {
    const opt = pipeResult(err('e')).ok();
    expect(isNone(opt)).toBe(true);
  });

  it('err() returns Some for Err', () => {
    const opt = pipeResult(err('my err')).err();
    expect(isSome(opt)).toBe(true);
    expect(unwrapOption(opt)).toBe('my err');
  });

  it('err() returns None for Ok', () => {
    const opt = pipeResult(ok('val')).err();
    expect(isNone(opt)).toBe(true);
  });

  // --- unwrap / expect ---
  it('unwrap returns value on Ok', () => {
    expect(pipeResult(ok(5)).unwrap()).toBe(5);
  });

  it('unwrap throws on Err', () => {
    expect(() => pipeResult(err('e')).unwrap()).toThrow('called `unwrapResult` on an `Err` value');
  });

  it('expect returns value on Ok', () => {
    expect(pipeResult(ok('data')).expect('missing')).toBe('data');
  });

  it('expect throws custom msg on Err', () => {
    expect(() => pipeResult(err('e')).expect('custom')).toThrow('custom');
  });

  it('unwrapErr returns error on Err', () => {
    expect(pipeResult(err('err')).unwrapErr()).toBe('err');
  });

  it('unwrapErr throws on Ok', () => {
    expect(() => pipeResult(ok(1)).unwrapErr()).toThrow('called `unwrapErr` on an `Ok` value');
  });

  it('expectErr returns error on Err', () => {
    expect(pipeResult(err('e')).expectErr('msg')).toBe('e');
  });

  it('expectErr throws on Ok', () => {
    expect(() => pipeResult(ok(1)).expectErr('msg')).toThrow('msg');
  });

  it('unwrapOr returns value on Ok', () => {
    expect(pipeResult(ok(10)).unwrapOr(999)).toBe(10);
  });

  it('unwrapOr returns default on Err', () => {
    expect(pipeResult(err('e')).unwrapOr(999)).toBe(999);
  });

  it('unwrapOrElse returns value on Ok', () => {
    const fn = vi.fn(() => 0);
    expect(pipeResult(ok(10)).unwrapOrElse(fn)).toBe(10);
    expect(fn).not.toHaveBeenCalled();
  });

  it('unwrapOrElse calls function with error on Err', () => {
    const result = pipeResult(err('abc')).unwrapOrElse(e => e.length);
    expect(result).toBe(3);
  });

  // --- match ---
  it('match applies onOk for Ok', () => {
    const result = pipeResult(ok('hello')).match(
      v => v.toUpperCase(),
      e => '0'
    );
    expect(result).toBe('HELLO');
  });

  it('match applies onErr for Err', () => {
    const result = pipeResult(err('fail')).match(
      v => {},
      e => e.length
    );
    expect(result).toBe(4);
  });

  it('allows complex chaining', () => {
    const res = pipeResult(ok('  rust '))
      .map(s => s.trim())
      .andThen(s => s.length > 0 ? ok(s.toUpperCase()) : err('empty'))
      .orElse(() => ok('DEFAULT'))
      .unwrap();

    expect(res).toBe('RUST');
  });

  it('handles Err path in chaining', () => {
    const res = pipeResult(err('start'))
      .mapErr(e => e + '!')
      .andThen(x => ok(x))
      .orElse(e => ok(`caught: ${e}`))
      .unwrap();

    expect(res).toBe('caught: start!');
  });
});