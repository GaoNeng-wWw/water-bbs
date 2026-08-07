<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
  useForwardPropsEmits,
  type PaginationRootEmits,
  type PaginationRootProps,
} from 'reka-ui';

const props = defineProps<PaginationRootProps>();
const emits = defineEmits<PaginationRootEmits>();
const forward = useForwardPropsEmits(props, emits);
</script>

<template>
  <pagination-root v-bind="forward">
    <pagination-list
      v-slot="{ items }"
      class="flex items-center gap-1 text-surface-fg"
    >
      <pagination-first
        class="w-9 h-9 flex items-center justify-center bg-transparent transition disabled:opacity-50 rounded-lg cursor-pointer hover:bg-surface-200"
      >
        <div class="icon-[material-symbols--keyboard-double-arrow-left]" />
      </pagination-first>
      <pagination-prev
        class="w-9 h-9 flex items-center justify-center bg-transparent text-surface-fg transition mr-4 disabled:opacity-50 rounded-lg cursor-pointer hover:bg-surface-200"
      >
        <div class="icon-[material-symbols--chevron-left]" />
      </pagination-prev>
      <template v-for="(page, index) in items">
        <pagination-list-item
          v-if="page.type === 'page'"
          :key="index"
          class="w-9 h-9 rounded-lg data-selected:bg-surface-200! hover:bg-surface-200 cursor-pointer transition"
          :value="page.value"
        >
          {{ page.value }}
        </pagination-list-item>
        <pagination-ellipsis
          v-else
          :key="page.type"
          :index="index"
          class="w-9 h-9 flex items-center justify-center"
        >
          &#8230;
        </pagination-ellipsis>
      </template>
      <pagination-next
        class="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-surface-200 transition ml-4 disabled:opacity-50 rounded-lg cursor-pointer"
      >
        <div class="icon-[material-symbols--chevron-right]" />
      </pagination-next>
      <pagination-last
        class="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-surface-200 transition disabled:opacity-50 rounded-lg cursor-pointer"
      >
        <div class="icon-[material-symbols--keyboard-double-arrow-right]" />
      </pagination-last>
    </pagination-list>
  </pagination-root>
</template>
