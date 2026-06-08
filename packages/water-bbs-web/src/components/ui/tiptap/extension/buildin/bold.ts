import type { Editor } from '@tiptap/vue-3';
import type { Ext } from '../../editor.props';
import { h } from 'vue';

export const bold: Ext = {
  icon: h('div', { class: 'i-material-symbols:format-bold size-4 text-warm-foreground' }),
  extension: null,
  isActive: function (editor: Editor): boolean {
    return editor.isActive('bold');
  },
  onClick: function (editor: Editor): void {
    editor.commands.toggleBold();
  },
};
