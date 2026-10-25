import { JSONContent } from '@tiptap/core';

export type WalkVisitor = {
  enter?: (node: JSONContent) => boolean;
  exit?: (node: JSONContent) => void;
};

export const walk = (root: JSONContent, visitor: WalkVisitor) => {
  const abort = visitor.enter?.(root);
  if (abort) {
    return abort;
  }
  if (root.content) {
    for (const child of root.content) {
      if (walk(child, visitor)){
        break;
      }
    }
  }
  visitor.exit?.(root);
};
