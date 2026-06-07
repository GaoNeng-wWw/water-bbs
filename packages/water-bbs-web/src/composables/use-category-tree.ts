import { categoryControllerListCategories, type CategorySummary } from '@/api';
import { reactive, ref } from 'vue';

export type FlattenTreeNode = {
  id: string;
  name: string;
  hasChildren: boolean;
  parentId: string;
};

export type FlattenTree = Map<string | null | undefined, FlattenTreeNode[]>;
export type NestTreeNode = {
  id: string;
  label: string;
  children: NestTreeNode[];
  leaf?: boolean;
};

export const useNestedCategoryTreeData = () => {
  const tree = ref<NestTreeNode[]>([]);
  const nodes = reactive(new Map<string, NestTreeNode>());

  const loadingParents = reactive(new Set<string>());
  const loadedParents = reactive(new Set<string>());

  const parentVersions = new Map<string, number>();

  const add = (node: CategorySummary) => {
    const treeNode: NestTreeNode = {
      id: node.id,
      label: node.name,
      children: [],
      leaf: !node.hasChildren,
    };
    nodes.set(node.id, treeNode);
    if (!node.parentId) {
      tree.value.push(treeNode);
    } else {
      const parentNode = nodes.get(node.parentId as unknown as string);
      if (!parentNode) {
        return;
      }
      parentNode.children = parentNode.children.filter(node => node.id !== '__shadow__');
      parentNode?.children.push(treeNode);
    }
  };
  const loadData = async (parent?: string) => {
    const parentKey = parent ?? '__root__';
    if (loadingParents.has(parentKey) || loadedParents.has(parentKey)) {
      return;
    }

    loadingParents.add(parentKey);
    const version = (parentVersions.get(parentKey) ?? 0) + 1;
    parentVersions.set(parentKey, version);

    try {
      const resp = await categoryControllerListCategories({ query: { parent } });
      const data = resp.data ?? [];
      if (parentVersions.get(parentKey) !== version) {
        return;
      }

      data.forEach((node) => {
        add(node);
      });
      loadedParents.add(parentKey);
    } catch (error) { /* empty */ } finally {
      loadingParents.delete(parentKey);
    }
  };
  const expand = (parent?: string) => {
    loadData(parent);
  };

  const reset = () => {
    tree.value = [];
    nodes.clear();
    loadingParents.clear();
    loadedParents.clear();
    parentVersions.clear();
  };

  const isLoading = (parent?: string) => loadingParents.has(parent ?? '__root__');
  const isLoaded = (parent?: string) => loadedParents.has(parent ?? '__root__');

  return {
    tree, // 外部只读
    expand,
    reset,
    isLoading,
    isLoaded,
    add,
  };
};
