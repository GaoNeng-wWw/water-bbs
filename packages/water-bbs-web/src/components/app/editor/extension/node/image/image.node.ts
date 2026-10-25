import type { CommandProps } from '@tiptap/core';
import Image from '@tiptap/extension-image';

export type InsertImageProps = {
  files: File[];
  uploadImage: (files: File[]) => Promise<string[]>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    img: {
      insertImage: (props: InsertImageProps) => ReturnType;
    };
  }
}

export const Img = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-id': {
        default: null,
        parseHTML: el => el.getAttribute('data-id'),
        renderHTML: (attr) => {
          return attr;
        },
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      insertImage: (props: InsertImageProps) =>
        ({ chain, state }: CommandProps) => {
          const pos = state.selection.from;
          const placeholder = props.files.map((f) => {
            return { id: `placeholder-${Date.now()}`, url: URL.createObjectURL(f) };
          });
          placeholder.forEach((placeholder) => {
            chain()
              .focus()
              .insertContentAt(pos, {
                type: this.name,
                attrs: {
                  src: placeholder.url,
                  id: placeholder.id,
                  uploading: true,
                },
              })
              .run();
          });
        },
    };
  },
});
