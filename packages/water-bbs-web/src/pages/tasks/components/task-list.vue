<script setup lang="ts">
import { vElementVisibility } from '@vueuse/components';
import { useInfiniteQuery, useQueryClient } from '@tanstack/vue-query';
import { getTasks } from '@/api';
import { computed, reactive } from 'vue';
import TaskItem from './task-item.vue';
import { UiTabs, UiTabItem } from '@/components/ui';
import { useI18n } from 'vue-i18n';

const filter: { status?: string } = reactive({
  status: undefined,
});
const client = useQueryClient();
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
  {
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      return getTasks({
        query: {
          cursor: pageParam,
          size: 20,
          ...filter,
        },
      });
    },
    getNextPageParam: (resp) => {
      return resp.data?.nextCursor ?? undefined;
    },
    initialPageParam: undefined as string | undefined,
    queryKey: ['task-list', filter.status],
  }, client
);
const { t } = useI18n({ useScope: 'local' });
const list = computed(() => {
  return data.value?.pages.flatMap(page => page.data?.items ?? []);
});
const filterStatusChange = (status: string) => {
  if (status === 'all') {
    filter.status = undefined;
    return client.invalidateQueries();
  }
  filter.status = status;
  return client.invalidateQueries();
};
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
</script>

<template>
  <div class="w-full space-y-3">
    <ui-tabs @active="filterStatusChange">
      <ui-tab-item id="all" value="all" :label="t('tab.all')" />
      <ui-tab-item id="completed" value="completed" :label="t('tab.completed')" />
      <ui-tab-item id="progress" value="progress" :label="t('tab.progress')" />
    </ui-tabs>
    <task-item v-for="item in list" :id="item.id" :key="item.id" :title="item.name" :desc="item.desc" :status="item.status" :can-claim="item.canClaim" />
    <div v-element-visibility="loadMore" />
  </div>
</template>

<i18n lang="yaml">
en-us:
  tab:
    all: All Task
    completed: Completed Task
    progress: Progress Task
zh-cn:
  tab:
    all: 所有任务
    completed: 已完成任务
    progress: 进行中任务
</i18n>
