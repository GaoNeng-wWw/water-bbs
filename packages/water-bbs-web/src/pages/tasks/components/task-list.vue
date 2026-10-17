<script setup lang="ts">
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import { getTasks } from '@/api';

const {data} = useInfiniteQuery(
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

console.log(data)

</script>

<template>
  <div class="w-full" />
</template>
