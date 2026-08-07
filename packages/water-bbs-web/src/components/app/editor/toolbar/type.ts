import type { Editor } from '@tiptap/vue-3';
import type { Component } from 'vue';

export type ToolbarItem = Button | Group | DropDown;

export type Fn = {
  disabled?: (editor: Editor) => boolean;
  active?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
};

export type Button = {
  type: 'button';
  icon: Component | string;
  tooltip?: string;
} & Fn;
export type Group = {
  type: 'group';
  children: ToolbarItem[];
} & Fn;
export type DropDown = {
  type: 'dropdown';
  icon: Component | string;
  children: ToolbarItem[];
} & Omit<Fn, 'onClick'>;
