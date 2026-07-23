<script lang="ts" setup>
import { ListboxGroupLabel, type ListboxGroupLabelProps } from 'reka-ui';

const props = defineProps<ListboxGroupLabelProps>();
</script>

<template>
  <listbox-group-label
    v-bind="{
      ...props,
      class: 'text-warm-foreground/50 mb-2 mt-2',
    }"
  >
    <slot />
  </listbox-group-label>
</template>
