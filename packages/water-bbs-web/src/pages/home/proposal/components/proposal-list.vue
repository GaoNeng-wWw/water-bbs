<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { listProposalItems } from '@/api';
import { computed } from 'vue';
import ProposalItem from './proposal-item.vue';

const { data } = useInfiniteQuery({
  queryKey: ['proposalItems'],
  queryFn: ({ pageParam }) => {
    return listProposalItems({
      query: {
        cursor: pageParam,
        size: 20,
      },
    })
      .then(resp => resp.data);
  },
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (param) => {
    return param?.nextCursor?.toString() ?? undefined;
  },
});

const items = computed(() => {
  const pages = data.value?.pages ?? [];
  return pages.flatMap(page => page?.items ?? []);
});
</script>

<template>
  <div class="w-full space-y-4">
    <proposal-item v-for="item in items" :id="item.id" :key="item.id" :name="item.title" :agree="item.yes" :disagree="item.no" />
  </div>
</template>
