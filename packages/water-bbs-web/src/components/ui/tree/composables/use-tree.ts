import { computed, reactive, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';
import type { FlattenNode, Node } from '../tree.prop';
import { flattenNode } from '../utils';

export type FlattenLeveledNode = FlattenNode & { level: number };

export type UseTreeOptions = {
  node: MaybeRefOrGetter<Node>;
  activeLimit: number;
  defaultActive: MaybeRefOrGetter<string[]>;
  onExpand?: (node: FlattenNode) => void;
  onActive?: (nodes: FlattenNode[]) => void;
};

export const useTree = (
  { node, activeLimit = 1, defaultActive, ...opts }: UseTreeOptions,
) => {
  const flattenedNodes = computed(() => {
    const n = toValue(node);
    return n.type === 'nested' ? n.nodes.map(node => flattenNode(null, node)).flat() : n.nodes;
  });
  const nodes = reactive(new Map<string, FlattenNode>());
  const levels = reactive(new Map<string, number>());
  const expanded = reactive(new Set<string>());
  const disabled = reactive(new Set<string>());
  const active = ref<string[]>([
    ...toValue(defaultActive),
  ]);
  const isExpanded = (id: string) => {
    return expanded.has(id);
  };
  const canShow = (id: string) => {
    const node = nodes.get(id);
    if (!node) {
      return false;
    }
    let cur: FlattenNode | undefined = node;
    // 顶层肯定可以展示
    if (!cur.parent) {
      return true;
    }
    while (cur.parent) {
      if (!isExpanded(cur.parent)) {
        return false;
      }
      cur = nodes.get(cur.parent);
      if (!cur) {
        return false;
      }
    }
    return true;
  };
  const toggleActive = (id: string) => {
    if (active.value.includes(id)) {
      const idx = active.value.indexOf(id);
      active.value.splice(idx, 1);
      return;
    }
    while (active.value.length >= activeLimit) {
      active.value.shift();
    }
    active.value.push(id);
    opts.onActive?.(
      active.value.map(activeId => nodes.get(activeId)!),
    );
  };
  const isLeaf = (id: string) => {
    return nodes.get(id)!.leaf;
  };
  const toggleExpand = (id: string) => {
    if (expanded.has(id)) {
      expanded.delete(id);
    } else {
      expanded.add(id);
    }
  };
  const isActive = (id: string) => active.value.includes(id);
  const getLevel = (id: string): number => {
  // 已经有缓存直接返回
    if (levels.has(id)) {
      return levels.get(id)!;
    }

    const node = nodes.get(id);
    if (!node) {
      return 0;
    }

    // 根节点
    if (!node.parent) {
      levels.set(id, 0);
      return 0;
    }

    // 递归获取父级层级，同时会缓存父级的 level
    const parentLevel = getLevel(node.parent);
    const level = parentLevel + 1;
    levels.set(id, level);
    return level;
  };
  const onClick = (id: string) => {
    if (disabled.has(id)) {
      return false;
    }
    toggleExpand(id);
    if (nodes.has(id)) {
      opts.onExpand?.(nodes.get(id)!);
    }
  };
  const flattenLeveledNode = computed(() => flattenedNodes.value.map<FlattenLeveledNode>(node => ({ ...node, level: getLevel(node.id) })));
  const activeNodes = computed(() => {
    return active.value.map(activeId => nodes.get(activeId)).filter(v => v !== undefined);
  });
  watch(flattenedNodes, () => {
    for (const node of flattenedNodes.value) {
      nodes.set(node.id, node);
    }
  }, { immediate: true, deep: true });
  return { onClick, flattenLeveledNode, canShow, isLeaf, isExpanded, isActive, toggleActive, activeNodes };
};
