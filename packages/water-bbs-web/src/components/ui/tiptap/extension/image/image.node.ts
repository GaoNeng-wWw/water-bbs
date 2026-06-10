import { createInlineMarkdownSpec, Node, VueNodeViewRenderer } from '@tiptap/vue-3';
import Image from './image.vue';
import type { NodeViewProps } from '@tiptap/vue-3';
import type { Component } from 'vue';

export const ImageNode = Node.create<never>({
  name: 'image',
  group: 'block',
  defining: true,
  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML(element) {
          return element.getAttribute('src') || '';
        },
        renderHTML({ src }) {
          return { src };
        },
      },
      width: {
        default: '',
        parseHTML(element) {
          return element.getAttribute('width') || '';
        },
        renderHTML({ width }) {
          return { width };
        },
      },
      height: {
        default: '',
        parseHTML(element) {
          return element.getAttribute('height') || '';
        },
        renderHTML({ height }) {
          return { height };
        },
      },
      alt: {
        default: '',
        parseHTML(element) {
          return element.getAttribute('alt') || '';
        },
        renderHTML({ alt }) {
          return { alt };
        },
      },
      lazy: {
        default: true,
        parseHTML(element) {
          return element.getAttribute('lazy') === 'true';
        },
        renderHTML({ lazy }) {
          return { lazy };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'img',
        getAttrs: element => ({
          src: element.getAttribute('src') || '',
          width: element.getAttribute('width') || '',
          height: element.getAttribute('height') || '',
          alt: element.getAttribute('alt') || '',
          lazy: element.getAttribute('lazy') === 'true',
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'img', { ...HTMLAttributes }, 0,
    ];
  },
  addNodeView() {
    return VueNodeViewRenderer(Image as Component<NodeViewProps>);
  },
  ...createInlineMarkdownSpec({
    nodeName: 'image',
    selfClosing: true,
    allowedAttributes: ['src', 'width', 'height', 'alt', 'lazy'],
    defaultAttributes: {
      src: '',
      width: '',
      height: '',
      alt: '',
      lazy: true,
    },
  }),
});
