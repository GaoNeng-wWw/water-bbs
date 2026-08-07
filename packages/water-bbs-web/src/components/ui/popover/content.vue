<script lang="ts" setup>
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui';
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from 'reka-ui';
import { computed } from 'vue';
import { popoverContentStyle } from './style';

export type Props = PopoverContentProps & {
  rounded?: 'xs' | 'sm' | 'md' | 'lg';
  widthFollowTrigger?: boolean;
};

defineOptions({
  inheritAttrs: true,
});
const props = defineProps<Props>();
const emits = defineEmits<PopoverContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const clazz = computed(() => popoverContentStyle({ rounded: props.rounded ?? 'md', widthFollowTrigger: props.widthFollowTrigger }));
</script>

<template>
  <popover-portal>
    <popover-content :class="[clazz, $attrs.class]" v-bind="forwarded">
      <slot />
    </popover-content>
  </popover-portal>
</template>
