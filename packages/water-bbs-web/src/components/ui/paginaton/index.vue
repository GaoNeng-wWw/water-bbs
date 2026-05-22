<script lang="ts" setup>
import { Pagination } from 'reka-ui/namespaced';

const { total = 0, size = 10 } = defineProps<{ total?: number; size?: number }>();
const modelValue = defineModel<number>({ required: false });
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <Pagination.Root v-model:page="modelValue" :total="total" :items-per-page="size" show-edge :sibling-count="5">
    <Pagination.List v-slot="{ items }" class="flex gap-4">
      <Pagination.First
        class="
          flex size-7 p-1.5 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition
          disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed
        "
      >
        <div class="size-full i-material-symbols:keyboard-double-arrow-left" />
      </Pagination.First>
      <Pagination.Prev
        class="
      flex p-1.5 size-7 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition
      disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed
      "
      >
        <div class="size-full i-material-symbols:keyboard-arrow-left" />
      </Pagination.Prev>
      <template v-for="(page, idx) in items">
        <Pagination.ListItem
          v-if="page.type === 'page'"
          :key="idx"
          :value="page.value"
          class="flex text-xs size-7 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition"
        >
          {{ page.value }}
        </Pagination.ListItem>
        <Pagination.Ellipsis
          v-else
          :key="page.type"
          :index="idx"
          class="size-7 flex items-center justify-center text-warm-foreground"
        >
          &#8230;
        </Pagination.Ellipsis>
      </template>
      <Pagination.Next
        class="
      flex p-1.5 size-7 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition
      disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed
      "
      >
        <div class="size-full i-material-symbols:keyboard-arrow-right" />
      </Pagination.Next>
      <Pagination.Last
        class="
        flex p-1.5 size-7 items-center justify-center rounded-md border border-warm-200 text-warm-foreground cursor-pointer text-sm hover:bg-warm-200/20 transition
        disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed
        "
      >
        <div class="size-full i-material-symbols:keyboard-double-arrow-right" />
      </Pagination.Last>
    </Pagination.List>
  </Pagination.Root>
</template>
