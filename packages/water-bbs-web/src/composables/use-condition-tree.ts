import { v7 } from 'uuid';
import { reactive, readonly } from 'vue';
import type { AllConditions, AnyConditions, ConditionProperties, NotConditions, TopLevelCondition } from 'json-rules-engine';

export type ConditionId = string & { readonly __brand: unique symbol };
export type FactId = string & { readonly __brand: unique symbol };

export const ROOT_ID = '__ROOT__' as ConditionId;

export const createConditionId = () => {
  return v7() as ConditionId;
};

export const createFactId = () => {
  return v7() as FactId;
};
export const createFactIdFromString = (val: string) => {
  return val as FactId;
};
export const createConditionIdFromString = (val: string) => {
  return val as ConditionId;
};

export type ConditionKind = 'any' | 'all' | 'not';
export type ConditionNode = {
  type: 'condition';
  kind: ConditionKind;
  id: ConditionId;
};
export type FactNode<T> = {
  type: 'fact';
  factName: string;
  operator: string;
  value: T;
  id: FactId;
};

export const isConditionNode = (node: RuleNode): node is ConditionNode =>
  node.type === 'condition';
export const isFactNode = (node: RuleNode): node is FactNode<unknown> =>
  node.type === 'fact';
export type Id = ConditionId | FactId;
export type IsConditionId<I extends Id> = I extends ConditionId ? true : false;
export type RuleNode = ConditionNode | FactNode<unknown>;
export type IsConditionNode<Node extends RuleNode> = Node extends ConditionNode ? true : false;

export const createConditionNode = (kind: 'any' | 'all' | 'not') => {
  return {
    type: 'condition',
    kind,
    id: createConditionId(),
  } satisfies ConditionNode;
};

export const createFactNode = <T>(name: string, operator: string, value: T) => {
  return {
    type: 'fact',
    factName: name,
    operator,
    value,
    id: createFactId(),
  } satisfies FactNode<T>;
};

export const useConditionTree = () => {
  const conditionMap = reactive(new Map<ConditionId, ConditionNode>());
  const factMap = reactive(new Map<FactId, FactNode<unknown>>());
  const revTree = reactive(new Map<Id, ConditionId>());
  const tree = reactive(new Map<ConditionId, (ConditionId | FactId)[]>());

  const rootNode: ConditionNode = { type: 'condition', kind: 'all', id: ROOT_ID };
  conditionMap.set(ROOT_ID, rootNode);
  tree.set(ROOT_ID, []);

  const findNode = (id: Id): RuleNode | null => {
    if (id === ROOT_ID) {
      return conditionMap.get(ROOT_ID) ?? null;
    };
    return conditionMap.get(id as ConditionId) ?? factMap.get(id as FactId) ?? null;
  };

  const getParent = (id: Id): ConditionNode | null => {
    const parentId = revTree.get(id);
    return parentId ? (conditionMap.get(parentId) ?? null) : null;
  };

  const getChildren = (id: ConditionId): Id[] => {
    return tree.get(id) ?? [];
  };
  const addNode = (node: RuleNode, parentId: Id = ROOT_ID) => {
    const parent = findNode(parentId);
    if (!parent) {
      throw new Error(`${parentId} Not Found`);
    }
    if (node.type === 'fact') {
      if (parent.type === 'fact') {
        throw new Error(`Can not add ${node.id} to ${parent.id}. Because, can not add fact to fact`);
      }
      if (parent.kind === 'not') {
        tree.set(parent.id, [node.id]);
      } else {
        if (tree.has(parent.id)) {
          tree.get(parent.id)?.push(node.id);
        } else {
          tree.set(parent.id, [node.id]);
        }
      }
      factMap.set(node.id, node);
      revTree.set(node.id, parent.id);
      return;
    }
    if (parent.type === 'fact') {
      throw new Error(`Can not add ${node.id} to ${parent.id}. Because, can not add condition to fact`);
    }
    if (tree.has(parent.id)) {
      tree.get(parent.id)?.push(node.id);
    } else {
      tree.set(parent.id, [node.id]);
    }
    tree.set(node.id, []);
    conditionMap.set(node.id, node);
    revTree.set(node.id, parent.id);
  };
  const removeNode = (id: Id): void => {
    const node = findNode(id);
    if (!node) {
      return;
    }

    if (isConditionNode(node)) {
      const children = tree.get(node.id) ?? [];
      for (const childId of [...children]) {
        removeNode(childId);
      }
      tree.delete(node.id);
      conditionMap.delete(node.id);
    } else {
      factMap.delete(node.id);
    }

    const parentId = revTree.get(id);
    if (parentId) {
      const siblings = tree.get(parentId);
      if (siblings) {
        const idx = siblings.indexOf(id);
        if (idx !== -1) {
          siblings.splice(idx, 1);
        };
      }
    }

    revTree.delete(id);
  };
  function updateNode(id: ConditionId, patch: Partial<Omit<ConditionNode, 'id'>>): void;
  function updateNode(id: FactId, patch: Partial<Omit<FactNode<any>, 'id'>>): void;
  function updateNode(id: Id, patch: Partial<Omit<ConditionNode, 'id'>> | Partial<Omit<FactNode<any>, 'id'>>) {
    const node = findNode(id);
    if (!node) {
      throw new Error(`${id} not found`);
    }

    if (node.type === 'condition' && 'kind' in patch) {
      node.kind = patch.kind!;
      if (node.kind === 'not') {
        const children = getChildren(node.id);
        if (children.length === 1) {
          return;
        }
        const [child, ...shouldRemovedChildren] = children;
        shouldRemovedChildren.forEach(removeNode);
        tree.set(node.id, [child]);
      }
    } else if (node.type === 'fact') {
      const factPatch = patch as Partial<Omit<FactNode<any>, 'id'>>;
      if (factPatch.factName !== undefined) {
        node.factName = factPatch.factName;
      }
      if (factPatch.operator !== undefined) {
        node.operator = factPatch.operator;
      }
      if (factPatch.value !== undefined) {
        node.value = factPatch.value;
      }
    }
  }

  const toCondition = (node: RuleNode): TopLevelCondition | ConditionProperties => {
    if (node.type === 'fact') {
      return {
        fact: node.factName,
        operator: node.operator,
        value: node.value,
      } as ConditionProperties;
    }
    const children: RuleNode[] = [];
    for (const child of getChildren(node.id)) {
      const node = findNode(child);
      if (!node) {
        continue;
      }
      children.push(node);
    }
    if (node.kind === 'not') {
      return {
        not: !children[0] ? {} : toCondition(children[0]),
      } as NotConditions;
    }
    return {
      [node.kind]: children.map(toCondition),
    } as unknown as AnyConditions | AllConditions;
  };

  return {
    addNode,
    removeNode,
    updateNode,
    findNode,
    getParent,
    getChildren,
    toCondition,
    tree: readonly(tree),
  };
};
