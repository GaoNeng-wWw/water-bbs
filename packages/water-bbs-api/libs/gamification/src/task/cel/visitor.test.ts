import { parse } from '@marcbachmann/cel-js';
import { extract } from './visitor';

describe('visitor', () => {
  it('visit id', () => {
    expect(extract(parse('a').ast).has('a')).toBe(true);
  });
  it('visit path', () => {
    const paths = [
      'a',
      'a.b',
      'a.b.c',
      `a.b["c"]`,
      `a["c"]["c"]`,
      `a["b"].c`,
      'a[0].c',
    ];
    const sets = paths
      .map(parse)
      .map((r) => r.ast)
      .map((ast) => extract(ast));
    for (let i = 0; i < paths.length; i++) {
      const set = sets[i];
      expect(set.has(paths[i])).toBeTruthy();
    }
  });
  it('function call', () => {
    const paths = [
      'fn(a)',
      'fn(a.b)',
      'fn(a.b.c)',
      `fn(a.b["c"])`,
      `fn(a["c"]["c"])`,
      `fn(a["b"].c)`,
      'fn(a[0].c)',
    ];
    const sets = paths
      .map(parse)
      .map((r) => r.ast)
      .map((ast) => extract(ast));
    for (let i = 0; i < paths.length; i++) {
      const set = sets[i];
      expect(
        set.has(paths[i].replace('fn', '').replace('(', '').replace(')', '')),
      ).toBeTruthy();
    }
  });
});
