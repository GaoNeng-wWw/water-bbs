import type { Ext } from '../../editor.props';
import { noop } from '@vueuse/core';
import { h } from 'vue';
import { ImageNode } from './image.node';
import icon from './icon.vue';

export const Image: Ext<typeof ImageNode> = {
  icon: h(icon),
  isActive: noop,
  extension: ImageNode,
};
