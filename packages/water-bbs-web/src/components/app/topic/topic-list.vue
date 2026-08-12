<script setup lang="ts">
import type { TopicInfo } from '@/api/types.gen.ts';
import { listAllTopic, listTopic } from '@/api/sdk.gen';
import { useOffsetPagination } from '@vueuse/core';
import { reactive, ref } from 'vue';
import { vElementVisibility } from '@vueuse/components';
import topicCard, { type CategoryInfo } from './topic-card.vue';

const { category } = defineProps<{ category: CategoryInfo }>();

const topicList = ref<TopicInfo[]>([]);

const fetchState = reactive({
  loading: false,
  done: false,
});

const fetchTopicList = (page: number, size: number) => {
  if (fetchState.loading || fetchState.done) {
    return;
  }
  fetchState.loading = true;
  const query = { page, size };
  const listTask = category.id ? listTopic({ path: { categoryId: category.id }, query }) : listAllTopic({ query });
  listTask
    .then(resp => resp.data)
    .then((data) => {
      if (!data?.data) {
        return;
      }
      fetchState.done = data.data.length === 0;
      const list = data.data as TopicInfo[];
      topicList.value.push(...list);
    })
    .finally(() => {
      fetchState.loading = false;
    });
};

const { currentPage, currentPageSize, next } = useOffsetPagination({
  page: 1,
  pageSize: 10,
});

const loadMore = () => {
  if (fetchState.loading || fetchState.done) {
    return;
  }
  next();
  fetchTopicList(currentPage.value, currentPageSize.value);
};

fetchTopicList(currentPage.value, currentPageSize.value);
</script>

<template>
  <div class="w-full space-y-5">
    <topic-card
      v-for="item in topicList"
      :id="item.id"
      :key="item.id"
      :title="item.title"
      :created-at="item.createdAt"
      :replies-total="item.replyTotal"
      :category="item.category"
      :author="item.author"
    />
    <div v-if="!fetchState.done" v-element-visibility="loadMore" class="w-full" />
  </div>
</template>
