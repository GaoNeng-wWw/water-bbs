import { ExpectTypeError } from '../error';
import {
  onLt,
  onLte,
  onGt,
  onGte,
  onEq,
  onIn,
  onNotIn,
  evalCondition,
} from './evaluator';

describe('onLt', () => {
  it('returns true when lhs < rhs', () => {
    expect(onLt(1, 2)._unsafeUnwrap()).toBe(true);
  });

  it('returns false when lhs >= rhs', () => {
    expect(onLt(2, 1)._unsafeUnwrap()).toBe(false);
    expect(onLt(1, 1)._unsafeUnwrap()).toBe(false);
  });

  it('returns err when lhs is not a number', () => {
    const result = onLt('a', 1);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns err when rhs is not a number', () => {
    const result = onLt(1, 'a');
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });
});

describe('onLte', () => {
  it('returns true when lhs <= rhs', () => {
    expect(onLte(1, 2)._unsafeUnwrap()).toBe(true);
    expect(onLte(1, 1)._unsafeUnwrap()).toBe(true);
  });

  it('returns false when lhs > rhs', () => {
    expect(onLte(2, 1)._unsafeUnwrap()).toBe(false);
  });

  it('returns err when lhs is not a number', () => {
    const result = onLte('a', 1);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns err when rhs is not a number', () => {
    const result = onLte(1, 'a');
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });
});

describe('onGt', () => {
  it('returns true when lhs > rhs', () => {
    expect(onGt(2, 1)._unsafeUnwrap()).toBe(true);
  });

  it('returns false when lhs <= rhs', () => {
    expect(onGt(1, 2)._unsafeUnwrap()).toBe(false);
    expect(onGt(1, 1)._unsafeUnwrap()).toBe(false);
  });

  it('returns err when lhs is not a number', () => {
    const result = onGt('a', 1);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns err when rhs is not a number', () => {
    const result = onGt(1, 'a');
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });
});

describe('onGte', () => {
  it('returns true when lhs >= rhs', () => {
    expect(onGte(2, 1)._unsafeUnwrap()).toBe(true);
    expect(onGte(1, 1)._unsafeUnwrap()).toBe(true);
  });

  it('returns false when lhs < rhs', () => {
    expect(onGte(1, 2)._unsafeUnwrap()).toBe(false);
  });

  it('returns err when lhs is not a number', () => {
    const result = onGte('a', 1);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns err when rhs is not a number', () => {
    const result = onGte(1, 'a');
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });
});

describe('onEq', () => {
  it('returns true when lhs === rhs (numbers)', () => {
    expect(onEq(1, 1)._unsafeUnwrap()).toBe(true);
    expect(onEq(0, 0)._unsafeUnwrap()).toBe(true);
  });

  it('returns true when lhs === rhs (strings)', () => {
    expect(onEq('a', 'a')._unsafeUnwrap()).toBe(true);
  });

  it('returns false when lhs !== rhs (numbers)', () => {
    expect(onEq(1, 2)._unsafeUnwrap()).toBe(false);
  });

  it('returns false when lhs !== rhs (different types)', () => {
    expect(onEq('1', 1)._unsafeUnwrap()).toBe(false);
    expect(onEq(1, '1')._unsafeUnwrap()).toBe(false);
  });

  it('never returns err - always ok since onEq does not type-check', () => {
    const result1 = onEq('a', 1);
    expect(result1.isOk()).toBe(true);
    expect(result1._unsafeUnwrap()).toBe(false);

    const result2 = onEq(1, 'a');
    expect(result2.isOk()).toBe(true);
    expect(result2._unsafeUnwrap()).toBe(false);
  });
});

describe('onIn', () => {
  it('returns true when lhs is in rhs array', () => {
    expect(onIn('a', ['a', 'b', 'c'])._unsafeUnwrap()).toBe(true);
    expect(onIn(1, [1, 2, 3])._unsafeUnwrap()).toBe(true);
  });

  it('returns false when lhs is not in rhs array', () => {
    expect(onIn('d', ['a', 'b', 'c'])._unsafeUnwrap()).toBe(false);
    expect(onIn(4, [1, 2, 3])._unsafeUnwrap()).toBe(false);
  });

  it('returns err when rhs is not an array', () => {
    const result = onIn('a', 1);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns err when lhs is an array', () => {
    const result = onIn(['a'], ['a', 'b']);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns false when rhs is an empty array', () => {
    expect(onIn('a', [])._unsafeUnwrap()).toBe(false);
  });
});

describe('onNotIn', () => {
  it('returns true when lhs is not in rhs array', () => {
    expect(onNotIn('d', ['a', 'b', 'c'])._unsafeUnwrap()).toBe(true);
    expect(onNotIn(4, [1, 2, 3])._unsafeUnwrap()).toBe(true);
  });

  it('returns false when lhs is in rhs array', () => {
    expect(onNotIn('a', ['a', 'b', 'c'])._unsafeUnwrap()).toBe(false);
    expect(onNotIn(1, [1, 2, 3])._unsafeUnwrap()).toBe(false);
  });

  it('returns err when rhs is not an array', () => {
    const result = onNotIn('a', 1);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns err when lhs is an array', () => {
    const result = onNotIn(['a'], ['a', 'b']);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
  });

  it('returns true when rhs is an empty array', () => {
    expect(onNotIn('a', [])._unsafeUnwrap()).toBe(true);
  });
});

describe('evalCondition', () => {
  describe('leaf expression', () => {
    it('evaluates lt operator', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'lt', goal: 12 },
        { 'time.now.hour': 10 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates lt operator (false)', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'lt', goal: 12 },
        { 'time.now.hour': 15 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('evaluates lte operator', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'lte', goal: 10 },
        { 'time.now.hour': 10 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates lte operator (false)', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'lte', goal: 9 },
        { 'time.now.hour': 10 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('evaluates gt operator', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'gt', goal: 5 },
        { 'time.now.hour': 10 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates gt operator (false)', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'gt', goal: 15 },
        { 'time.now.hour': 10 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('evaluates gte operator', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'gte', goal: 10 },
        { 'time.now.hour': 10 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates gte operator (false)', () => {
      const result = evalCondition(
        { id: '1', field: 'time.now.hour', operator: 'gte', goal: 11 },
        { 'time.now.hour': 10 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('evaluates eq operator', () => {
      const result = evalCondition(
        { id: '1', field: 'user.id', operator: 'eq', goal: 42 },
        { 'user.id': 42 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates eq operator (false)', () => {
      const result = evalCondition(
        { id: '1', field: 'user.id', operator: 'eq', goal: 99 },
        { 'user.id': 42 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('evaluates neq operator', () => {
      const result = evalCondition(
        { id: '1', field: 'user.id', operator: 'neq', goal: 99 },
        { 'user.id': 42 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates neq operator (false)', () => {
      const result = evalCondition(
        { id: '1', field: 'user.id', operator: 'neq', goal: 42 },
        { 'user.id': 42 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('evaluates in operator', () => {
      const result = evalCondition(
        {
          id: '1',
          field: 'event.type',
          operator: 'in',
          goal: ['post.created', 'comment.created'],
        },
        { 'event.type': 'post.created' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates in operator (false)', () => {
      const result = evalCondition(
        {
          id: '1',
          field: 'event.type',
          operator: 'in',
          goal: ['post.created', 'comment.created'],
        },
        { 'event.type': 'user.liked' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('evaluates not_in operator', () => {
      const result = evalCondition(
        {
          id: '1',
          field: 'event.type',
          operator: 'not_in',
          goal: ['post.deleted'],
        },
        { 'event.type': 'post.created' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('evaluates not_in operator (false)', () => {
      const result = evalCondition(
        {
          id: '1',
          field: 'event.type',
          operator: 'not_in',
          goal: ['post.created'],
        },
        { 'event.type': 'post.created' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('returns err when field is undefined in context', () => {
      const result = evalCondition(
        { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
        {},
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
    });

    it('propagates type error from lt operator', () => {
      const result = evalCondition(
        { id: '1', field: 'user.nick', operator: 'lt', goal: 5 },
        { 'user.nick': 'hello' },
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
    });

    it('propagates type error from in operator (rhs not array)', () => {
      const result = evalCondition(
        {
          id: '1',
          field: 'event.type',
          operator: 'in',
          goal: 'not-array',
        },
        { 'event.type': 'a' },
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
    });
  });

  describe('all combinator', () => {
    it('returns true when all conditions are true', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'test' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('returns false when one condition is false', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'wrong' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('returns false when all conditions are false', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 99 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'wrong' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('returns true for empty all array (vacuous truth)', () => {
      const result = evalCondition({ all: [] }, {});
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('propagates error when a child condition errors', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            { id: '2', field: 'user.nick', operator: 'lt', goal: 5 },
          ],
        },
        { 'user.id': 1, 'user.nick': 'hello' },
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
    });

    it('evaluates with all operators', () => {
      const result = evalCondition(
        {
          all: [
            { id: '', field: 'user.id', operator: 'eq', goal: 1 },
            { id: '', field: 'user.nick', operator: 'eq', goal: 'test' },
            { id: '', field: 'user.avatar', operator: 'neq', goal: 'test' },
            {
              id: '',
              field: 'user.created_at',
              operator: 'in',
              goal: [1, 2, 3],
            },
            {
              id: '',
              field: 'user.created_at',
              operator: 'not_in',
              goal: [4, 5, 6],
            },
          ],
        },
        {
          'user.id': 1,
          'user.avatar': 'test-avatar',
          'user.nick': 'test',
          'user.created_at': 2,
        },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });
  });

  describe('any combinator', () => {
    it('returns true when at least one condition is true', () => {
      const result = evalCondition(
        {
          any: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 99 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'test' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('returns true when all conditions are true', () => {
      const result = evalCondition(
        {
          any: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'test' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('returns false when all conditions are false', () => {
      const result = evalCondition(
        {
          any: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 99 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'wrong' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('returns false for empty any array', () => {
      const result = evalCondition({ any: [] }, {});
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('propagates error when a child condition errors', () => {
      const result = evalCondition(
        {
          any: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 99 },
            { id: '2', field: 'user.nick', operator: 'lt', goal: 5 },
          ],
        },
        { 'user.id': 1, 'user.nick': 'hello' },
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
    });
  });

  describe('not combinator', () => {
    it('returns true when all children are false (negated)', () => {
      const result = evalCondition(
        {
          not: [{ id: '1', field: 'user.id', operator: 'eq', goal: 99 }],
        },
        { 'user.id': 1 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('returns false when a child is true (negated)', () => {
      const result = evalCondition(
        {
          not: [{ id: '1', field: 'user.id', operator: 'eq', goal: 1 }],
        },
        { 'user.id': 1 },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('returns true when all children are false (multiple)', () => {
      const result = evalCondition(
        {
          not: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 99 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'wrong' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('returns false when at least one child is true (multiple)', () => {
      const result = evalCondition(
        {
          not: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            { id: '2', field: 'user.nick', operator: 'eq', goal: 'wrong' },
          ],
        },
        { 'user.id': 1, 'user.nick': 'test' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('returns true for empty not array (vacuous truth)', () => {
      const result = evalCondition({ not: [] }, {});
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('propagates error when a child condition errors', () => {
      const result = evalCondition(
        {
          not: [{ id: '1', field: 'user.nick', operator: 'lt', goal: 5 }],
        },
        { 'user.nick': 'hello' },
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
    });
  });

  describe('nested conditions', () => {
    it('all containing any', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            {
              any: [
                { id: '2', field: 'user.nick', operator: 'eq', goal: 'admin' },
                {
                  id: '3',
                  field: 'user.nick',
                  operator: 'eq',
                  goal: 'moderator',
                },
              ],
            },
          ],
        },
        { 'user.id': 1, 'user.nick': 'moderator' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('all containing any (any is false)', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            {
              any: [
                { id: '2', field: 'user.nick', operator: 'eq', goal: 'admin' },
                {
                  id: '3',
                  field: 'user.nick',
                  operator: 'eq',
                  goal: 'moderator',
                },
              ],
            },
          ],
        },
        { 'user.id': 1, 'user.nick': 'user' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(false);
    });

    it('any containing all', () => {
      const result = evalCondition(
        {
          any: [
            {
              all: [
                { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
                { id: '2', field: 'user.nick', operator: 'eq', goal: 'admin' },
              ],
            },
            { id: '3', field: 'user.id', operator: 'gt', goal: 100 },
          ],
        },
        { 'user.id': 1, 'user.nick': 'admin' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('not containing all', () => {
      const result = evalCondition(
        {
          not: [
            {
              all: [
                { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
                { id: '2', field: 'user.nick', operator: 'eq', goal: 'admin' },
              ],
            },
          ],
        },
        { 'user.id': 1, 'user.nick': 'user' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('deeply nested: all > any > not', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            {
              any: [
                {
                  not: [
                    {
                      id: '2',
                      field: 'user.nick',
                      operator: 'eq',
                      goal: 'banned',
                    },
                  ],
                },
              ],
            },
          ],
        },
        { 'user.id': 1, 'user.nick': 'active' },
      );
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(true);
    });

    it('propagates error from deeply nested condition', () => {
      const result = evalCondition(
        {
          all: [
            { id: '1', field: 'user.id', operator: 'eq', goal: 1 },
            {
              any: [{ id: '2', field: 'user.nick', operator: 'lt', goal: 5 }],
            },
          ],
        },
        { 'user.id': 1, 'user.nick': 'hello' },
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ExpectTypeError);
    });
  });
});
