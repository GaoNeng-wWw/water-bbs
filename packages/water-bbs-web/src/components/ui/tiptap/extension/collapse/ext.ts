import { noop } from '@vueuse/core';
import type { Ext } from '../../editor.props';
import { CollapseNode } from './node';
import { h, render } from 'vue';
import Popover from './popover.vue';

export const Collapse: Ext = {
  icon: Popover,
  extension: CollapseNode,
  isActive: noop,
};
