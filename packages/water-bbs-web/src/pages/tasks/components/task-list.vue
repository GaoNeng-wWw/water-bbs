<script setup lang="ts">
import { vElementVisibility } from '@vueuse/components';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { getTasks } from '@/api';
import { computed } from 'vue';
import TaskItem from './task-item.vue';

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isPending } = useInfiniteQuery(
  {
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      return getTasks({
        query: {
          cursor: pageParam,
          size: 20,
        },
      });
    },
    getNextPageParam: (resp) => {
      return resp.data?.nextCursor ?? undefined;
    },
    initialPageParam: undefined as string | undefined,
    queryKey: ['task-list'],
  },
);
const loadMore = (visible: boolean) => {
  if (
    !visible
    || !hasNextPage.value
    || isFetchingNextPage.value
  ) {
    return;
  }
  fetchNextPage();
};
const list = computed(() => {
  return data.value?.pages.flatMap(page => page.data?.items ?? []);
});
</script>

<template>
  <div class="w-full space-y-3">
    <task-item v-for="item in list" :id="item.id" :key="item.id" :title="item.name" :desc="item.desc" :status="item.status" :can-claim="item.canClaim" />
    <div v-element-visibility="loadMore" />
  </div>
</template>
