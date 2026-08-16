<script lang="ts" setup>
import { getTransactions } from '@/api';
import { useProfile } from '@/store';
import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { vElementVisibility } from '@vueuse/components';
import { UiShadowScroll } from '@/components/ui';

const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage, suspense } = useInfiniteQuery({
  queryFn: async (opts) => {
    const resp = await getTransactions({ query: { limit: 200, cursor: opts.pageParam || undefined } });
    return {
      item: resp.data?.items ?? [],
      nextCursor: resp.data?.nextCursor ?? null,
    };
  },
  queryKey: ['wallet.transcations'],
  suspense: true,
  retry: 2,
  staleTime: 1000 * 60 * 5,
  initialPageParam: '',
  getNextPageParam(last) {
    return last.nextCursor;
  },
});

await suspense();

const items = computed(() => {
  if (!data.value) {
    return [];
  }
  return data.value.pages.map(page => page.item).flat();
});

const profile = useProfile();

const isIncome = (id: string) => {
  return id === profile.profile?.id.toString();
};
const loadMore = () => {
  if (!hasNextPage.value || isFetchingNextPage.value) {
    return;
  }
  fetchNextPage();
};
</script>

<template>
  <ui-shadow-scroll class="w-full h-50">
    <div v-if="items.length && status === 'success'" class="w-full">
      <div v-for="item in items" :key="item.id" class="w-full text-surface-fg">
        <div class="w-full flex justify-between items-baseline-last">
          <p>{{ item.detail }}</p>
          <p :data-income="isIncome(item.to)" class="data-[income=true]:text-success-500 text-danger-500 font-bold">
            {{ isIncome(item.to) ? '+' : '-' }} {{ item.amount }}
          </p>
        </div>
      </div>
    </div>
    <div v-element-visibility="loadMore" class="w-full h-1" />
  </ui-shadow-scroll>
</template>
