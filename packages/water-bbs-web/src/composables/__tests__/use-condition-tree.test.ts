import {
  createConditionId,
  createConditionNode,
  createFactId,
  createFactNode,
  isConditionNode,
  isFactNode,
  ROOT_ID,
  useConditionTree,
} from '../use-condition-tree';

describe(useConditionTree.name, () => {
  describe('initialization', () => {
    it('root node exists with kind "all"', () => {
      const tree = useConditionTree();
      const root = tree.findNode('__ROOT__' as any);
      expect(root).not.toBeNull();
      expect(root!.type).toBe('condition');
      expect((root as any).kind).toBe('all');
    });

    it('root has no children initially', () => {
      const tree = useConditionTree();
      const children = tree.getChildren('__ROOT__' as any);
      expect(children).toHaveLength(0);
    });
  });

  describe('addNode', () => {
    it('add fact node to root', () => {
      const tree = useConditionTree();
      const fact = createFactNode('age', 'equal', 18);
      tree.addNode(fact);
      expect(tree.findNode(fact.id)).toStrictEqual(fact);
    });

    it('add condition node to root', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('any');
      tree.addNode(cond);
      expect(tree.findNode(cond.id)).toStrictEqual(cond);
    });

    it('add multiple nodes to root', () => {
      const tree = useConditionTree();
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      const cond = createConditionNode('any');
      tree.addNode(fact1);
      tree.addNode(fact2);
      tree.addNode(cond);
      const children = tree.getChildren(ROOT_ID);
      expect(children).toHaveLength(3);
    });

    it('nested: condition inside condition, fact inside condition', () => {
      const tree = useConditionTree();
      const anyNode = createConditionNode('any');
      const fact = createFactNode('score', 'greaterThan', 80);
      tree.addNode(anyNode);
      tree.addNode(fact, anyNode.id);
      expect(tree.findNode(fact.id)).toStrictEqual(fact);
      expect(tree.getParent(fact.id)).toStrictEqual(anyNode);
      expect(tree.getChildren(anyNode.id)).toContain(fact.id);
    });

    it('deeply nested structure', () => {
      const tree = useConditionTree();
      const all = createConditionNode('all');
      const any = createConditionNode('any');
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(all);
      tree.addNode(any, all.id);
      tree.addNode(fact, any.id);
      expect(tree.getParent(all.id)!.type).toBe('condition');
      expect(tree.getParent(any.id)).toStrictEqual(all);
      expect(tree.getParent(fact.id)).toStrictEqual(any);
    });

    it('add fact to "not" condition replaces existing child', () => {
      const tree = useConditionTree();
      const notNode = createConditionNode('not');
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(notNode);
      tree.addNode(fact1, notNode.id);
      expect(tree.getChildren(notNode.id)).toHaveLength(1);
      expect(tree.getChildren(notNode.id)).toContain(fact1.id);

      tree.addNode(fact2, notNode.id);
      const children = tree.getChildren(notNode.id);
      expect(children).toHaveLength(1);
      expect(children).toContain(fact2.id);
      expect(children).not.toContain(fact1.id);
    });

    it('add fact to "all" condition appends', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(allNode);
      tree.addNode(fact1, allNode.id);
      tree.addNode(fact2, allNode.id);
      const children = tree.getChildren(allNode.id);
      expect(children).toHaveLength(2);
      expect(children).toContain(fact1.id);
      expect(children).toContain(fact2.id);
    });

    it('add fact to "any" condition appends', () => {
      const tree = useConditionTree();
      const anyNode = createConditionNode('any');
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(anyNode);
      tree.addNode(fact1, anyNode.id);
      tree.addNode(fact2, anyNode.id);
      const children = tree.getChildren(anyNode.id);
      expect(children).toHaveLength(2);
    });

    it('throws when adding fact to fact', () => {
      const tree = useConditionTree();
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(fact1);
      expect(() => tree.addNode(fact2, fact1.id)).toThrowError(
        /can not add fact to fact/i,
      );
    });

    it('throws when adding condition to fact', () => {
      const tree = useConditionTree();
      const fact = createFactNode('a', 'equal', 1);
      const cond = createConditionNode('any');
      tree.addNode(fact);
      expect(() => tree.addNode(cond, fact.id)).toThrowError(
        /can not add condition to fact/i,
      );
    });

    it('throws when adding to non-existent parent', () => {
      const tree = useConditionTree();
      const fact = createFactNode('a', 'equal', 1);
      const fakeId = createConditionId();
      expect(() => tree.addNode(fact, fakeId)).toThrowError(/Not Found/);
    });

    it('add condition to "not" condition is allowed (appends)', () => {
      const tree = useConditionTree();
      const notNode = createConditionNode('not');
      const innerAll = createConditionNode('all');
      tree.addNode(notNode);
      tree.addNode(innerAll, notNode.id);
      expect(tree.getChildren(notNode.id)).toContain(innerAll.id);
    });
  });

  describe('removeNode', () => {
    it('remove fact node', () => {
      const tree = useConditionTree();
      const fact = createFactNode('a', 'equal', 1);
      tree.addNode(fact);
      tree.removeNode(fact.id);
      expect(tree.findNode(fact.id)).toBeNull();
      const children = tree.getChildren('__ROOT__' as any);
      expect(children).not.toContain(fact.id);
    });

    it('remove condition node cascades to children', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(cond);
      tree.addNode(fact1, cond.id);
      tree.addNode(fact2, cond.id);
      tree.removeNode(cond.id);
      expect(tree.findNode(cond.id)).toBeNull();
      expect(tree.findNode(fact1.id)).toBeNull();
      expect(tree.findNode(fact2.id)).toBeNull();
    });

    it('remove deeply nested condition cascades recursively', () => {
      const tree = useConditionTree();
      const all = createConditionNode('all');
      const any = createConditionNode('any');
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(all);
      tree.addNode(any, all.id);
      tree.addNode(fact, any.id);
      tree.removeNode(all.id);
      expect(tree.findNode(all.id)).toBeNull();
      expect(tree.findNode(any.id)).toBeNull();
      expect(tree.findNode(fact.id)).toBeNull();
    });

    it('remove non-existent node is a no-op', () => {
      const tree = useConditionTree();
      const fakeId = createFactId();
      expect(() => tree.removeNode(fakeId)).not.toThrow();
    });

    it('remove one sibling does not affect others', () => {
      const tree = useConditionTree();
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(fact1);
      tree.addNode(fact2);
      tree.removeNode(fact1.id);
      expect(tree.findNode(fact1.id)).toBeNull();
      expect(tree.findNode(fact2.id)).toStrictEqual(fact2);
      const children = tree.getChildren('__ROOT__' as any);
      expect(children).toHaveLength(1);
      expect(children).toContain(fact2.id);
    });

    it('remove child from "not" condition clears children', () => {
      const tree = useConditionTree();
      const notNode = createConditionNode('not');
      const fact = createFactNode('a', 'equal', 1);
      tree.addNode(notNode);
      tree.addNode(fact, notNode.id);
      tree.removeNode(fact.id);
      expect(tree.findNode(fact.id)).toBeNull();
      expect(tree.getChildren(notNode.id)).toHaveLength(0);
    });
  });

  describe('updateNode', () => {
    it('update condition node kind', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      tree.addNode(cond);
      tree.updateNode(cond.id, { kind: 'any' });
      const updated = tree.findNode(cond.id);
      expect(updated!.type).toBe('condition');
      expect((updated as any).kind).toBe('any');
    });

    it('update condition kind through all variants', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      tree.addNode(cond);
      for (const kind of ['any', 'all', 'not'] as const) {
        tree.updateNode(cond.id, { kind });
        expect((tree.findNode(cond.id) as any).kind).toBe(kind);
      }
    });

    it('update fact node factName', () => {
      const tree = useConditionTree();
      const fact = createFactNode('old', 'equal', 1);
      tree.addNode(fact);
      tree.updateNode(fact.id, { factName: 'new' });
      const updated = tree.findNode(fact.id) as any;
      expect(updated.factName).toBe('new');
      expect(updated.operator).toBe('equal');
      expect(updated.value).toBe(1);
    });

    it('update fact node operator', () => {
      const tree = useConditionTree();
      const fact = createFactNode('age', 'equal', 18);
      tree.addNode(fact);
      tree.updateNode(fact.id, { operator: 'greaterThan' });
      const updated = tree.findNode(fact.id) as any;
      expect(updated.operator).toBe('greaterThan');
    });

    it('update fact node value', () => {
      const tree = useConditionTree();
      const fact = createFactNode('age', 'equal', 18);
      tree.addNode(fact);
      tree.updateNode(fact.id, { value: 25 });
      const updated = tree.findNode(fact.id) as any;
      expect(updated.value).toBe(25);
    });

    it('update multiple fact fields at once', () => {
      const tree = useConditionTree();
      const fact = createFactNode('old', 'equal', 1);
      tree.addNode(fact);
      tree.updateNode(fact.id, { factName: 'new', operator: 'lessThan', value: 100 });
      const updated = tree.findNode(fact.id) as any;
      expect(updated.factName).toBe('new');
      expect(updated.operator).toBe('lessThan');
      expect(updated.value).toBe(100);
    });

    it('update fact value with different type', () => {
      const tree = useConditionTree();
      const fact = createFactNode('name', 'equal', 'alice');
      tree.addNode(fact);
      tree.updateNode(fact.id, { value: 'bob' });
      const updated = tree.findNode(fact.id) as any;
      expect(updated.value).toBe('bob');
    });

    it('update fact value with array', () => {
      const tree = useConditionTree();
      const fact = createFactNode('tags', 'in', ['a']);
      tree.addNode(fact);
      tree.updateNode(fact.id, { value: ['a', 'b'] });
      const updated = tree.findNode(fact.id) as any;
      expect(updated.value).toStrictEqual(['a', 'b']);
    });

    it('throws when updating non-existent node', () => {
      const tree = useConditionTree();
      const fakeId = createFactId();
      expect(() => tree.updateNode(fakeId, { factName: 'x' })).toThrowError(/not found/);
    });

    it('update condition without kind in patch does nothing', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      tree.addNode(cond);
      tree.updateNode(cond.id, {});
      expect((tree.findNode(cond.id) as any).kind).toBe('all');
    });
  });

  describe('findNode', () => {
    it('find root node', () => {
      const tree = useConditionTree();
      const root = tree.findNode('__ROOT__' as any);
      expect(root).not.toBeNull();
      expect(root!.type).toBe('condition');
    });

    it('find existing fact node', () => {
      const tree = useConditionTree();
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(fact);
      expect(tree.findNode(fact.id)).toStrictEqual(fact);
    });

    it('find existing condition node', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('any');
      tree.addNode(cond);
      expect(tree.findNode(cond.id)).toStrictEqual(cond);
    });

    it('returns null for non-existent id', () => {
      const tree = useConditionTree();
      expect(tree.findNode(createFactId())).toBeNull();
      expect(tree.findNode(createConditionId())).toBeNull();
    });

    it('returns null after node is removed', () => {
      const tree = useConditionTree();
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(fact);
      tree.removeNode(fact.id);
      expect(tree.findNode(fact.id)).toBeNull();
    });
  });

  describe('getParent', () => {
    it('parent of root child is root', () => {
      const tree = useConditionTree();
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(fact);
      const parent = tree.getParent(fact.id);
      expect(parent).not.toBeNull();
      expect(parent!.type).toBe('condition');
      expect((parent as any).kind).toBe('all');
    });

    it('parent of deeply nested node', () => {
      const tree = useConditionTree();
      const all = createConditionNode('all');
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(all);
      tree.addNode(fact, all.id);
      expect(tree.getParent(fact.id)).toStrictEqual(all);
    });

    it('parent of root is null', () => {
      const tree = useConditionTree();
      expect(tree.getParent('__ROOT__' as any)).toBeNull();
    });

    it('parent of non-existent node is null', () => {
      const tree = useConditionTree();
      expect(tree.getParent(createFactId())).toBeNull();
    });

    it('parent updated after sibling removal', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(cond);
      tree.addNode(fact, cond.id);
      expect(tree.getParent(fact.id)).toStrictEqual(cond);
    });
  });

  describe('getChildren', () => {
    it('children of root', () => {
      const tree = useConditionTree();
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(fact1);
      tree.addNode(fact2);
      const children = tree.getChildren('__ROOT__' as any);
      expect(children).toHaveLength(2);
      expect(children).toContain(fact1.id);
      expect(children).toContain(fact2.id);
    });

    it('children of condition with mixed types', () => {
      const tree = useConditionTree();
      const all = createConditionNode('all');
      const fact = createFactNode('a', 'equal', 1);
      const innerAny = createConditionNode('any');
      tree.addNode(all);
      tree.addNode(fact, all.id);
      tree.addNode(innerAny, all.id);
      const children = tree.getChildren(all.id);
      expect(children).toHaveLength(2);
      expect(children).toContain(fact.id);
      expect(children).toContain(innerAny.id);
    });

    it('children of leaf condition is empty', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      tree.addNode(cond);
      expect(tree.getChildren(cond.id)).toHaveLength(0);
    });

    it('children of non-existent condition is empty', () => {
      const tree = useConditionTree();
      expect(tree.getChildren(createConditionId())).toHaveLength(0);
    });

    it('children reflect additions and removals', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(cond);
      tree.addNode(fact1, cond.id);
      tree.addNode(fact2, cond.id);
      expect(tree.getChildren(cond.id)).toHaveLength(2);
      tree.removeNode(fact1.id);
      expect(tree.getChildren(cond.id)).toHaveLength(1);
      expect(tree.getChildren(cond.id)).toContain(fact2.id);
    });
  });

  describe('type guards', () => {
    it('isConditionNode', () => {
      const cond = createConditionNode('all');
      const fact = createFactNode('x', 'equal', 1);
      expect(isConditionNode(cond)).toBe(true);
      expect(isConditionNode(fact)).toBe(false);
    });

    it('isFactNode', () => {
      const cond = createConditionNode('all');
      const fact = createFactNode('x', 'equal', 1);
      expect(isFactNode(fact)).toBe(true);
      expect(isFactNode(cond)).toBe(false);
    });
  });

  describe('factory functions', () => {
    it('createConditionNode produces valid node', () => {
      for (const kind of ['any', 'all', 'not'] as const) {
        const node = createConditionNode(kind);
        expect(node.type).toBe('condition');
        expect(node.kind).toBe(kind);
        expect(node.id).toBeTruthy();
      }
    });

    it('createFactNode produces valid node', () => {
      const node = createFactNode('age', 'greaterThan', 18);
      expect(node.type).toBe('fact');
      expect(node.factName).toBe('age');
      expect(node.operator).toBe('greaterThan');
      expect(node.value).toBe(18);
      expect(node.id).toBeTruthy();
    });

    it('createConditionId generates unique ids', () => {
      const ids = new Set(Array.from({ length: 100 }, createConditionId));
      expect(ids.size).toBe(100);
    });

    it('createFactId generates unique ids', () => {
      const ids = new Set(Array.from({ length: 100 }, createFactId));
      expect(ids.size).toBe(100);
    });

    it('condition ids and fact ids are from different brands', () => {
      const condId = createConditionId();
      const factId = createFactId();
      expect(typeof condId).toBe('string');
      expect(typeof factId).toBe('string');
    });
  });

  describe('integration: build and modify a rule tree', () => {
    it('build a complex tree, verify structure, then teardown', () => {
      const tree = useConditionTree();

      const all = createConditionNode('all');
      const any = createConditionNode('any');
      const not = createConditionNode('not');
      const fact1 = createFactNode('age', 'greaterThan', 18);
      const fact2 = createFactNode('role', 'equal', 'admin');
      const fact3 = createFactNode('active', 'equal', true);

      tree.addNode(all);
      tree.addNode(fact1, all.id);
      tree.addNode(any, all.id);
      tree.addNode(fact2, any.id);
      tree.addNode(not, any.id);
      tree.addNode(fact3, not.id);

      expect(tree.getChildren('__ROOT__' as any)).toHaveLength(1);
      expect(tree.getChildren(all.id)).toHaveLength(2);
      expect(tree.getChildren(any.id)).toHaveLength(2);
      expect(tree.getChildren(not.id)).toHaveLength(1);

      tree.removeNode(all.id);
      expect(tree.findNode(all.id)).toBeNull();
      expect(tree.findNode(any.id)).toBeNull();
      expect(tree.findNode(not.id)).toBeNull();
      expect(tree.findNode(fact1.id)).toBeNull();
      expect(tree.findNode(fact2.id)).toBeNull();
      expect(tree.findNode(fact3.id)).toBeNull();
      expect(tree.getChildren('__ROOT__' as any)).toHaveLength(0);
    });

    it('update nodes in a tree and verify', () => {
      const tree = useConditionTree();
      const cond = createConditionNode('all');
      const fact = createFactNode('x', 'equal', 0);
      tree.addNode(cond);
      tree.addNode(fact, cond.id);

      tree.updateNode(cond.id, { kind: 'any' });
      tree.updateNode(fact.id, { factName: 'y', operator: 'lessThan', value: 10 });

      const updatedCond = tree.findNode(cond.id) as any;
      expect(updatedCond.kind).toBe('any');

      const updatedFact = tree.findNode(fact.id) as any;
      expect(updatedFact.factName).toBe('y');
      expect(updatedFact.operator).toBe('lessThan');
      expect(updatedFact.value).toBe(10);
    });
  });

  describe('toCondition', () => {
    it('converts a single fact node to ConditionProperties', () => {
      const tree = useConditionTree();
      const fact = createFactNode('age', 'greaterThan', 18);
      const result = tree.toCondition(fact);
      expect(result).toStrictEqual({
        fact: 'age',
        operator: 'greaterThan',
        value: 18,
      });
    });

    it('converts fact with string value', () => {
      const tree = useConditionTree();
      const fact = createFactNode('name', 'equal', 'alice');
      const result = tree.toCondition(fact);
      expect(result).toStrictEqual({
        fact: 'name',
        operator: 'equal',
        value: 'alice',
      });
    });

    it('converts fact with boolean value', () => {
      const tree = useConditionTree();
      const fact = createFactNode('active', 'equal', true);
      const result = tree.toCondition(fact);
      expect(result).toStrictEqual({
        fact: 'active',
        operator: 'equal',
        value: true,
      });
    });

    it('converts fact with array value', () => {
      const tree = useConditionTree();
      const fact = createFactNode('tags', 'in', ['a', 'b']);
      const result = tree.toCondition(fact);
      expect(result).toStrictEqual({
        fact: 'tags',
        operator: 'in',
        value: ['a', 'b'],
      });
    });

    it('converts "all" condition with fact children', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      const fact1 = createFactNode('age', 'greaterThan', 18);
      const fact2 = createFactNode('role', 'equal', 'admin');
      tree.addNode(allNode);
      tree.addNode(fact1, allNode.id);
      tree.addNode(fact2, allNode.id);
      const result = tree.toCondition(allNode);
      expect(result).toStrictEqual({
        all: [
          { fact: 'age', operator: 'greaterThan', value: 18 },
          { fact: 'role', operator: 'equal', value: 'admin' },
        ],
      });
    });

    it('converts "any" condition with fact children', () => {
      const tree = useConditionTree();
      const anyNode = createConditionNode('any');
      const fact1 = createFactNode('x', 'equal', 1);
      const fact2 = createFactNode('y', 'equal', 2);
      tree.addNode(anyNode);
      tree.addNode(fact1, anyNode.id);
      tree.addNode(fact2, anyNode.id);
      const result = tree.toCondition(anyNode);
      expect(result).toStrictEqual({
        any: [
          { fact: 'x', operator: 'equal', value: 1 },
          { fact: 'y', operator: 'equal', value: 2 },
        ],
      });
    });

    it('converts "not" condition with a fact child', () => {
      const tree = useConditionTree();
      const notNode = createConditionNode('not');
      const fact = createFactNode('banned', 'equal', true);
      tree.addNode(notNode);
      tree.addNode(fact, notNode.id);
      const result = tree.toCondition(notNode);
      expect(result).toStrictEqual({
        not: { fact: 'banned', operator: 'equal', value: true },
      });
    });

    it('converts "not" condition with a condition child', () => {
      const tree = useConditionTree();
      const notNode = createConditionNode('not');
      const innerAll = createConditionNode('all');
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(notNode);
      tree.addNode(innerAll, notNode.id);
      tree.addNode(fact1, innerAll.id);
      tree.addNode(fact2, innerAll.id);
      const result = tree.toCondition(notNode);
      expect(result).toStrictEqual({
        not: {
          all: [
            { fact: 'a', operator: 'equal', value: 1 },
            { fact: 'b', operator: 'equal', value: 2 },
          ],
        },
      });
    });

    it('converts nested all → any → fact', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      const anyNode = createConditionNode('any');
      const fact1 = createFactNode('x', 'equal', 1);
      const fact2 = createFactNode('y', 'equal', 2);
      tree.addNode(allNode);
      tree.addNode(anyNode, allNode.id);
      tree.addNode(fact1, anyNode.id);
      tree.addNode(fact2, anyNode.id);
      const result = tree.toCondition(allNode);
      expect(result).toStrictEqual({
        all: [
          {
            any: [
              { fact: 'x', operator: 'equal', value: 1 },
              { fact: 'y', operator: 'equal', value: 2 },
            ],
          },
        ],
      });
    });

    it('converts deeply nested structure: all → any → not → fact', () => {
      const tree = useConditionTree();
      const all = createConditionNode('all');
      const any = createConditionNode('any');
      const not = createConditionNode('not');
      const fact = createFactNode('active', 'equal', false);
      tree.addNode(all);
      tree.addNode(any, all.id);
      tree.addNode(not, any.id);
      tree.addNode(fact, not.id);
      const result = tree.toCondition(all);
      expect(result).toStrictEqual({
        all: [
          {
            any: [
              { not: { fact: 'active', operator: 'equal', value: false } },
            ],
          },
        ],
      });
    });

    it('converts "all" condition with no children', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      tree.addNode(allNode);
      const result = tree.toCondition(allNode);
      expect(result).toStrictEqual({ all: [] });
    });

    it('converts "any" condition with no children', () => {
      const tree = useConditionTree();
      const anyNode = createConditionNode('any');
      tree.addNode(anyNode);
      const result = tree.toCondition(anyNode);
      expect(result).toStrictEqual({ any: [] });
    });

    it('converts "not" condition with no children (not: undefined)', () => {
      const tree = useConditionTree();
      const notNode = createConditionNode('not');
      tree.addNode(notNode);
      const result = tree.toCondition(notNode);
      expect(result).toStrictEqual({ not: {} });
    });

    it('converts mixed children: facts and conditions under "all"', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      const fact1 = createFactNode('age', 'greaterThan', 18);
      const innerAny = createConditionNode('any');
      const fact2 = createFactNode('role', 'equal', 'admin');
      const fact3 = createFactNode('vip', 'equal', true);
      tree.addNode(allNode);
      tree.addNode(fact1, allNode.id);
      tree.addNode(innerAny, allNode.id);
      tree.addNode(fact2, innerAny.id);
      tree.addNode(fact3, innerAny.id);
      const result = tree.toCondition(allNode);
      expect(result).toStrictEqual({
        all: [
          { fact: 'age', operator: 'greaterThan', value: 18 },
          {
            any: [
              { fact: 'role', operator: 'equal', value: 'admin' },
              { fact: 'vip', operator: 'equal', value: true },
            ],
          },
        ],
      });
    });

    it('converts root node with direct fact children', () => {
      const tree = useConditionTree();
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(fact1);
      tree.addNode(fact2);
      const root = tree.findNode(ROOT_ID)!;
      const result = tree.toCondition(root);
      expect(result).toStrictEqual({
        all: [
          { fact: 'a', operator: 'equal', value: 1 },
          { fact: 'b', operator: 'equal', value: 2 },
        ],
      });
    });

    it('skips missing children gracefully', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      const fact = createFactNode('x', 'equal', 1);
      tree.addNode(allNode);
      tree.addNode(fact, allNode.id);
      const result = tree.toCondition(allNode);
      expect(result).toStrictEqual({
        all: [{ fact: 'x', operator: 'equal', value: 1 }],
      });
    });

    it('reflects updates made via updateNode', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      const fact = createFactNode('age', 'equal', 18);
      tree.addNode(allNode);
      tree.addNode(fact, allNode.id);
      tree.updateNode(fact.id, { factName: 'score', operator: 'greaterThan', value: 80 });
      const result = tree.toCondition(allNode);
      expect(result).toStrictEqual({
        all: [{ fact: 'score', operator: 'greaterThan', value: 80 }],
      });
    });

    it('reflects removals: removed child not in output', () => {
      const tree = useConditionTree();
      const allNode = createConditionNode('all');
      const fact1 = createFactNode('a', 'equal', 1);
      const fact2 = createFactNode('b', 'equal', 2);
      tree.addNode(allNode);
      tree.addNode(fact1, allNode.id);
      tree.addNode(fact2, allNode.id);
      tree.removeNode(fact1.id);
      const result = tree.toCondition(allNode);
      expect(result).toStrictEqual({
        all: [{ fact: 'b', operator: 'equal', value: 2 }],
      });
    });
  });
});