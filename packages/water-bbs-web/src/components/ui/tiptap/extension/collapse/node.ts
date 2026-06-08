import { createBlockMarkdownSpec, Node, VueNodeViewRenderer } from '@tiptap/vue-3';
import { v7 } from 'uuid';
import Render from './render.vue';

export const CollapseNode = Node.create({
  name: 'collapse',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return {
      label: {
        default: '',
        parseHTML(element) {
          return element.getAttribute('data-label') || '';
        },
        renderHTML(attributes) {
          return { 'data-label': attributes.label };
        },
      },
      id: {
        default: v7(),
        parseHTML(element) {
          return element.getAttribute('data-id') || v7();
        },
        renderHTML(attributes) {
          return { 'data-id': attributes.id };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-collapse]',
        getAttrs: dom => ({
          label: dom.getAttribute('label') || '',
          id: dom.getAttribute('id') || v7(),
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-collapse': '', ...HTMLAttributes }, 0];
  },
  addNodeView() {
    return VueNodeViewRenderer(Render);
  },
  ...createBlockMarkdownSpec({
    nodeName: 'collapse',
    defaultAttributes: { label: '', id: v7() },
    allowedAttributes: ['label', 'id'],
    content: 'block',
  }),
});
