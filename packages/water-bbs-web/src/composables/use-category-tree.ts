import { categoryControllerListCategories } from '@/api';
import { UiCollapse, UiCollapseItem } from '@/components/ui';
import { computed, h, reactive, type VNode } from 'vue';
import { useEventBus, type Callback } from './use-events-bus';

export type TreeNode = {
  id: string;
  name: string;
  hasChildren: boolean;
  parentId: string;
};

export type Tree = Map<string | null, TreeNode[]>;

export const useCategoryTree = () => {
  const tree: Tree = reactive(new Map());
  const rootNode = computed(() => tree.get(null) ?? []);
  const active = reactive(new Set<string>());
  const expanded = reactive(new Set<string>());
  const expandedEventBus = useEventBus<TreeNode, void>();
  const activeBus = useEventBus<TreeNode, void>();
  const onExpand = (fn: Callback<TreeNode, void>) => {
    expandedEventBus.on('category-tree.on-expand', fn);
  };
  const onActive = (fn: Callback<TreeNode, void>) => {
    activeBus.on('category-tree.on-active', fn);
  };
  const expand = (parentId?: string) => {
    if (tree.has(parentId ?? null)) {
      return;
    }
    return categoryControllerListCategories({ query: { parent: parentId } })
      .then(resp => resp.data ?? [])
      .then((nodes) => {
        nodes.forEach((node) => {
          const pa = node.parentId as unknown as string;
          const treeNode = { id: node.id, parentId: pa, name: node.name, hasChildren: node.hasChildren };
          if (tree.has(pa)) {
            const siblings = tree.get(pa)!;
            if (!siblings.some(n => n.id === treeNode.id)) {
              siblings.push(treeNode);
            }
          } else {
            tree.set(pa, [treeNode]);
          }
        });
      });
  };

  const onClick = async (node: TreeNode) => {
    if (active.size) {
      active.clear();
    }
    active.add(node.id);
    activeBus.emit('category-tree.on-active', node);
    if (node.hasChildren) {
      if (expanded.has(node.id)) {
        expanded.delete(node.id);
      } else {
        expanded.add(node.id);
        expandedEventBus.emit('category-tree.on-expand', node);
      }
      expand(node.id);
    }
  };

  const render = (node: TreeNode): VNode => {
    return h(
      UiCollapseItem,
      {
        label: node.name,
        key: node.id,
        id: node.id,
      },
      {
        header: () => h('div', {
          onClick: () => {
            onClick(node);
          }, class: [
            'text-warm-foreground cursor-pointer pl-2 py-1 rounded-md hover:bg-warm-200/50 flex items-center gap-2',
            active.has(node.id) ? 'bg-warm-200/30' : '',
          ],
        }, [
          node.hasChildren && h('div', { class: ['i-material-symbols:arrow-forward-ios-rounded transition duration-300', expanded.has(node.id) ? 'rotate-90' : 'rotate-0'] }),
          h('span', node.name),
        ]),
        default: (tree.get(node.id) ?? []).length
          ? () => {
            const childrenRaw = tree.get(node.id) ?? [];
            const childrenVNodes = childrenRaw.map(render);
            if (!childrenVNodes.length) {
              return null;
            }
            return h('div', { class: 'pl-4' }, h(
              UiCollapse,
              null,
              () => {
                return childrenVNodes;
              },
            ));
          }
          : () => null,
      },
    );
  };
  const activeNodes = computed(() => {
    return Array.from(active.values())
      .map(key => tree.get(key))
      .filter(v => v !== undefined)
      .flat();
  });
  const expandedNodes = computed(() => {
    return Array.from(expanded.values())
      .flatMap(k => tree.get(k))
      .filter(node => node !== undefined);
  });
  const roots = computed(() => rootNode.value.map(render));
  return { expand, roots, activeNodes, expandedNodes, onExpand, onActive };
};
