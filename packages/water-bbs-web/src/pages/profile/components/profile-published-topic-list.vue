<script setup lang="ts">
import { getPublishedTopic } from '@/api/sdk.gen.ts';
import ProfilePublishedTopicCard from './profile-published-topic-card.vue';
import type { TopicInfo } from '@/api/types.gen.ts';
import { useRouter } from 'vue-router';
import { ref, type Ref } from 'vue';
import { vElementVisibility } from '@vueuse/components';
import { useOffsetPagination } from '@vueuse/core';

const props = defineProps<{ id: string }>();
const router = useRouter();
const topicList: Ref<TopicInfo[]> = ref([]);
const loading = ref(false);
const done = ref(false);

const fetchPublishedTopic = (page: number = 1, size: number = 10) => {
  if (loading.value || done.value) {
    return;
  }
  getPublishedTopic({
    path: { id: props.id },
    query: {
      page,
      size,
    },
  }).then((resp) => {
    if (resp.status !== 200) {
      return router.push({ path: '/', replace: true })
        .then(() => resp.data);
    }
    return resp.data;
  })
    .then((data) => {
      if (!data) {
        done.value = true;
        return;
      }
      const topicInfos = data.data as TopicInfo[];
      if (topicInfos.length === 0) {
        done.value = true;
        return;
      }
      topicList.value.push(...topicInfos);
    })
    .finally(() => {
      loading.value = false;
    });
};

const { next, currentPage, currentPageSize } = useOffsetPagination({ page: 1, pageSize: 10 });

const loadMore = () => {
  if (done.value || loading.value) {
    return;
  }
  loading.value = true;
  next();
  fetchPublishedTopic(currentPage.value, currentPageSize.value);
};

fetchPublishedTopic();
</script>

<template>
  <div class="w-full space-y-5">
    <profile-published-topic-card
      v-for="item in topicList"
      :id="item.id"
      :key="item.id"
      :title="item.title"
      :created-at="item.createdAt"
      :replies-total="item.repliesTotal"
      :category="item.category"
    />
    <div v-if="!done" v-element-visibility="loadMore" class="w-full px-4" />
  </div>
</template>
