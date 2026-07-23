<script lang="ts" setup>
import { Select } from 'reka-ui/namespaced';
import type { SelectItemProps } from 'reka-ui';

const props = defineProps<SelectItemProps>();
</script>

<template>
  <Select.Item
    :value="value"
    :disabled="disabled"
    class="
          data-[disabled]:hover:bg-transparent data-[disabled]:cursor-not-allowed data-[disabled]:text-warm-500
          text-warm-foreground p-1 px-2 rounded-md outline-none cursor-pointer transition duration-fast ease-in-out
          hover:bg-warm-200
          data-[state='checked']:bg-warm-200 text-base
        "
  >
    <Select.ItemText>
      <slot />
    </Select.ItemText>
  </Select.Item>
</template>
