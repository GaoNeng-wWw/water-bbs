<script lang="ts" setup>
import { useSlots } from 'vue';
import { useContext, type TabItemProps } from './props';

const {id, label, disabled = false } = defineProps<TabItemProps>();

const ctx = useContext();

const slots = useSlots();
ctx.onMounted(id, label, slots.default!, disabled);
</script>

<template>
  <div class="w-full" />
</template>
