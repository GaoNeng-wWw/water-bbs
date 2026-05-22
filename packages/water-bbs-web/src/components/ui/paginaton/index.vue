<script lang="ts" setup>
import { Pagination } from 'reka-ui/namespaced';

const {total=0, size = 10} = defineProps<{total?: number, size?: number}>();
const modelValue = defineModel<number>({required: false});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <Pagination.Root v-model:page="modelValue" :total="total" :items-per-page="size">
    <Pagination.List class="flex gap-4" v-slot="{ items }">
      <Pagination.First
        class="flex size-8 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition"
      >
        <div class="size-full i-material-symbols:keyboard-double-arrow-left" />
      </Pagination.First>
      <template v-for="(page, idx) in items">
        <Pagination.ListItem
          v-if="page.type === 'page'"
          :key="idx"
          :value="page.value"
          class="flex size-8 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition"
        >
          {{ page.value }}
        </Pagination.ListItem>
      </template>
      <Pagination.Last class="flex size-8 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition">
        <div class="size-full i-material-symbols:keyboard-double-arrow-right" />
      </Pagination.Last>
    </Pagination.List>
  </Pagination.Root>
</template>
