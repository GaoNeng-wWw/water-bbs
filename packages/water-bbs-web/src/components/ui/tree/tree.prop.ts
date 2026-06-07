export type NodeState = { expanded: boolean; disabled: boolean };
export type NestedNode = {
  id: string;
  label: string;
  leaf?: boolean;
  children: NestedNode[];
};
export type FlattenNode = {
  id: string;
  label: string;
  parent: string | null;
  leaf: boolean;
};
export type Node = {
  type: 'flatten';
  nodes: FlattenNode[];
} | {
  type: 'nested';
  nodes: NestedNode[];
};
export type TreeProps = {
  nodes?: NestedNode[];
};
