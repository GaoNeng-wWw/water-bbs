import type { Editor } from '@tiptap/vue-3';
import { h } from 'vue';
import type { Ext } from '../../editor.props';

export const italic: Ext = {
  icon: h('div', { class: 'i-material-symbols:format-italic size-4 text-warm-foreground' }),
  extension: null,
  isActive: function (editor: Editor): boolean {
    return editor.isActive('italic');
  },
  onClick: function (editor: Editor): void {
    editor.commands.toggleItalic();
  },
};
