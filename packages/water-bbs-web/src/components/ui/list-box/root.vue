<script lang="ts" setup>
import { ListboxRoot, type ListboxRootProps, type ListboxRootEmits, useForwardPropsEmits, ListboxContent, ListboxGroup } from 'reka-ui';

const props = defineProps<ListboxRootProps>();
const emits = defineEmits<ListboxRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <listbox-root
    v-bind="forwarded"
    class="w-full"
  >
    <listbox-content class="space-y-1">
      <listbox-group class="space-y-2">
        <slot />
      </listbox-group>
    </listbox-content>
  </listbox-root>
</template>
