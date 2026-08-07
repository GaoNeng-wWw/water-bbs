import { h, type Component, type VNode } from 'vue';
import type { Button, DropDown, Group, ToolbarItem } from './type';
import { UiButton, UiPopover, UiPopoverContent, UiPopoverTrigger } from '@/components/ui';
import type { Editor } from '@tiptap/vue-3';

export const resolveIcon = (icon: Component | string) => {
  return h(
    UiButton,
    { icon: true, variant: 'ghost', size: 'sm' },
    () => [
      typeof icon === 'string' ? h('div', { class: ['size-5 bg-surface-fg', icon] }) : icon,
    ]);
};

export const renderButton = (button: Button, editor: Editor) => {
  const { icon } = button;
  return h(
    UiButton, {
      disabled: button.disabled?.(editor),
      onClick: () => button.onClick(editor),
      variant: button.active?.(editor) ? 'flat' : 'ghost',
      icon: true,
      size: 'sm',
    },
    () => [typeof icon === 'string' ? h('div', { class: ['size-5 bg-surface-fg', icon] }) : icon],
  );
};

export const renderGroup = (group: Group, editor: Editor) => {
  return h(
    'div',
    {
      class: 'flex gap-2 flex-wrap',
    },
    () => group.children.map(node => render(node, editor)),
  );
};

export const renderDropdown = (dropdown: DropDown, editor: Editor) => {
  return h(
    UiPopover,
    null,
    () => [
      h(
        UiPopoverTrigger,
        { asChild: true, disabled: dropdown.disabled?.(editor) },
        () => [resolveIcon(dropdown.icon)],
      ),
      h(
        UiPopoverContent,
        {},
        () => h('div', { class: 'flex flex-col flex-wrap gap-3' }, () => dropdown.children.map(node => render(node, editor))),
      ),
    ],
  );
};

export function render(node: ToolbarItem, editor: Editor): VNode {
  if (node.type === 'button') {
    return renderButton(node, editor);
  }
  if (node.type === 'group') {
    return renderGroup(node, editor);
  };
  return renderDropdown(node, editor);
}
