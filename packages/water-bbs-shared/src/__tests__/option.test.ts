import {
    describe,
    expect,
    it,
    vi
} from 'vitest';
import { andOption, andThenOption, expectOption, filterOption, isErr, isNone, isOk, isSome, none, okOr, okOrElse, orElseOption, orOption, pipeOption, some, unwrapOption, unwrapOr, unwrapOrElse, unwrapResult, zipOption } from '../option-result';

const val = [1, 0, null, undefined, true, 'hello world', { 'hello': 'world' }];
for (const v of val) {
    it(`Some(${JSON.stringify(v)}) is ${JSON.stringify(v)}`, () => {
        expect(pipeOption(some(v)).unwrap()).toBe(v)
    })
    it(`Some(${JSON.stringify(v)}) is not none`, () => {
        expect(pipeOption(some(v)).isNone()).toBe(false)
    })
    it(`Some(${JSON.stringify(v)}) is some`, () => {
        expect(pipeOption(some(v)).isSome()).toBe(true)
    })
}
it('map', () => {
    expect(
        pipeOption(some(1))
            .map((v) => v + 1)
            .unwrap()
    )
        .toBe(2)
})
describe('unwrapOption', () => {
    it('should return the value inside Some', () => {
        expect(unwrapOption(some(42))).toBe(42);
    });

    it('should throw on None with default message', () => {
        expect(() => unwrapOption(none)).toThrow('called `unwrapOption` on a `None` value');
    });

    it('should throw on None with custom message', () => {
        expect(() => unwrapOption(none, 'my error')).toThrow('my error');
    });
});

describe('expectOption', () => {
    it('should return the value inside Some', () => {
        expect(expectOption(some('hello'), 'should exist')).toBe('hello');
    });

    it('should throw with the given message on None', () => {
        expect(() => expectOption(none, 'missing value')).toThrow('missing value');
    });
});


describe('unwrapOr', () => {
    it('should return the value when Some', () => {
        expect(unwrapOr(some(10), 99)).toBe(10);
    });

    it('should return default when None', () => {
        expect(unwrapOr(none, 99)).toBe(99);
    });
});

describe('unwrapOrElse', () => {
    it('should return the value when Some', () => {
        expect(unwrapOrElse(some(5), () => 100)).toBe(5);
    });

    it('should call the function and return its result when None', () => {
        expect(unwrapOrElse(none, () => 200)).toBe(200);
    });

    it('should not call the function when Some', () => {
        const fn = vi.fn(() => 999);
        unwrapOrElse(some(1), fn);
        expect(fn).not.toHaveBeenCalled();
    });
});


describe('andThenOption', () => {
    it('should apply the function to Some value', () => {
        const result = andThenOption(some(3), x => some(x * 2));
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toBe(6);
    });

    it('should return None if the function returns None', () => {
        const result = andThenOption(some(3), () => none);
        expect(isNone(result)).toBe(true);
    });

    it('should return None without calling the function if input is None', () => {
        const fn = vi.fn(() => some(0));
        const result = andThenOption(none, fn);
        expect(isNone(result)).toBe(true);
        expect(fn).not.toHaveBeenCalled();
    });
});


describe('filterOption', () => {
    it('should keep Some that satisfies the predicate', () => {
        const result = filterOption(some(4), x => x > 2);
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toBe(4);
    });

    it('should turn Some to None if predicate fails', () => {
        const result = filterOption(some(1), x => x > 2);
        expect(isNone(result)).toBe(true);
    });

    it('should return None immediately if input is None', () => {
        const result = filterOption(none, x => x > 2);
        expect(isNone(result)).toBe(true);
    });
});


describe('okOr', () => {
    it('should convert Some to Ok', () => {
        const res = okOr(some('data'), 'error');
        expect(isOk(res)).toBe(true);
        expect(unwrapResult(res)).toBe('data');
    });

    it('should convert None to Err', () => {
        const res = okOr(none, 'oops');
        expect(isErr(res)).toBe(true);
        if (isErr(res)) expect(res.error).toBe('oops');
    });
});

describe('okOrElse', () => {
    it('should convert Some to Ok', () => {
        const res = okOrElse(some(123), () => 'fail');
        expect(isOk(res)).toBe(true);
        expect(unwrapResult(res)).toBe(123);
    });

    it('should convert None to Err using the provided function', () => {
        const res = okOrElse(none, () => 'dynamic error');
        expect(isErr(res)).toBe(true);
        if (isErr(res)) expect(res.error).toBe('dynamic error');
    });

    it('should not call the error function when Some', () => {
        const fn = vi.fn(() => 'should not be called');
        okOrElse(some(true), fn);
        expect(fn).not.toHaveBeenCalled();
    });
});


describe('orOption', () => {
    it('should return the first if it is Some', () => {
        const result = orOption(some(1), some(2));
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toBe(1);
    });

    it('should return the second if the first is None', () => {
        const result = orOption(none, some(2));
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toBe(2);
    });

    it('should return None if both are None', () => {
        const result = orOption(none, none);
        expect(isNone(result)).toBe(true);
    });
});

describe('orElseOption', () => {
    it('should return the original if it is Some', () => {
        const result = orElseOption(some('a'), () => some('b'));
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toBe('a');
    });

    it('should call the function if input is None', () => {
        const result = orElseOption(none, () => some('fallback'));
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toBe('fallback');
    });

    it('should return None if function returns None', () => {
        const result = orElseOption(none, () => none);
        expect(isNone(result)).toBe(true);
    });

    it('should not call the function if input is Some', () => {
        const fn = vi.fn(() => some('x'));
        orElseOption(some('a'), fn);
        expect(fn).not.toHaveBeenCalled();
    });
});


describe('zipOption', () => {
    it('should combine two Some into a tuple', () => {
        const result = zipOption(some('hello'), some(42));
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toEqual(['hello', 42]);
    });

    it('should return None if first is None', () => {
        const result = zipOption(none, some(42));
        expect(isNone(result)).toBe(true);
    });

    it('should return None if second is None', () => {
        const result = zipOption(some('hello'), none);
        expect(isNone(result)).toBe(true);
    });

    it('should return None if both are None', () => {
        const result = zipOption(none, none);
        expect(isNone(result)).toBe(true);
    });
});

describe('andOption', () => {
    it('should return the second Option if first is Some', () => {
        const result = andOption(some(1), some('b'));
        expect(isSome(result)).toBe(true);
        expect(unwrapOption(result)).toBe('b');
    });

    it('should return None if first is Some but second is None', () => {
        const result = andOption(some(1), none);
        expect(isNone(result)).toBe(true);
    });

    it('should return None if first is None', () => {
        const result = andOption(none, some('b'));
        expect(isNone(result)).toBe(true);
    });
});