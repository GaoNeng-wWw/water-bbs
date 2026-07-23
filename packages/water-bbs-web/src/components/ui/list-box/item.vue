<script lang="ts" setup>
import { ListboxItem, type ListboxItemProps, type ListboxItemEmits, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<ListboxItemProps>();
const emits = defineEmits<ListboxItemEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <listbox-item
    v-bind="forwarded"
    class="w-full p-2 rounded-full cursor-pointer hover:bg-warm-800/10 data-[highlighted]:bg-warm-800/10 data-[state='checked']:bg-warm-800/10"
  >
    <slot />
  </listbox-item>
</template>
