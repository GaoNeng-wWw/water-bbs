<script lang="ts" setup>
import type { ListboxGroupProps } from 'reka-ui';
import { ListboxGroup } from 'reka-ui';

const props = defineProps<ListboxGroupProps>();
</script>

<template>
  <listbox-group
    v-bind="{
      ...props,
      class: 'space-y-2',
    }"
  >
    <slot />
  </listbox-group>
</template>
