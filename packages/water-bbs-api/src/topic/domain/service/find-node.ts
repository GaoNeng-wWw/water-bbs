import { JSONContent } from '@tiptap/core';
import { walk } from './tiptap-tree-walker';

export const findNode = <T>(
  root: JSONContent,
  filter: (node: JSONContent) => boolean,
) => {
  const target: T[] = [];
  walk(root, {
    enter: (node) => {
      if (filter(node)) {
        target.push(node as T);
        return true;
      }
      return false;
    },
  });
  return target;
};
