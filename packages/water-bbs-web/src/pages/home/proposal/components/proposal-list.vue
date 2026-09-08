<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { listProposalItems } from '@/api';
import { ref } from 'vue';
import ProposalItem from './proposal-item.vue';

const { data, isLoading, refetch } = useInfiniteQuery({
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
</script>

<template>
  <div class="w-full space-y-4">
    <proposal-item />
    <proposal-item />
    <proposal-item />
    <proposal-item />
    <proposal-item />
  </div>
</template>
