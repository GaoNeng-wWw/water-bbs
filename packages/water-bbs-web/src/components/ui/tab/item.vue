<script lang="ts" setup>
import { useSlots } from 'vue';
import { CONTEXT_KEY } from './tab.context';
import { getContext } from '@/utils';

const { id, label } = defineProps<{ id: string; label: string; active?: boolean }>();

const ctx = getContext(CONTEXT_KEY);
const slot = useSlots().default?.();

ctx.register({
  component: slot ?? null,
  key: id,
  label,
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <slot />
</template>
