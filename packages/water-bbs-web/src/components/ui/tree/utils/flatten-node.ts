import type { FlattenNode, NestedNode } from '../tree.prop';

export const flattenNode = (parent: NestedNode | null, node: NestedNode): FlattenNode[] => {
  const cur: FlattenNode = { id: node.id, label: node.label, parent: parent?.id ?? null, leaf: !node.children || node.children.length === 0};
  return [
    cur,
    ...node.children.map(child => flattenNode(node, child)).flat(),
  ];
};
