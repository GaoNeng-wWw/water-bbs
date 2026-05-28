<script lang="ts" setup>
import { useThrottleFn } from '@vueuse/core';
import { vElementVisibility } from '@vueuse/components';
import { postControllerGetPosts, type PostSummary } from '@/api';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { ref, watch } from 'vue';
import PostItem from './post-item.vue';

const { categoryId } = defineProps<{
  categoryId?: string;
}>();

const preId = ref('');
const datas = ref<PostSummary[]>([]);
const loading = ref(false);
const fininsh = ref(false);

const loadData = (preId: string) => {
  loading.value = true;
  postControllerGetPosts({
    client: NOT_PUBLIC_ENDPOINT,
    query: {
      size: 20,
      preId,
      category: categoryId,
    },
  })
    .then(data => data.data)
    .then(data => (data?.data ?? []) as PostSummary[])
    .then((raw) => {
      if (!raw.length) {
        fininsh.value = true;
      }
      datas.value.push(...raw);
    })
    .finally(() => {
      loading.value = false;
    });
};
loadData(preId.value);
watch(() => categoryId, () => {
  preId.value = '';
  datas.value = [];
  loadData(preId.value);
});
const loadMore = useThrottleFn(() => {
  const last = datas.value.at(-1);
  if (!last || loading.value || fininsh.value) {
    return;
  }
  loadData(last.id);
}, 500, false, true);
</script>

<template>
  <div class="w-full h-full">
    <post-item v-for="data in datas" :id="data.id" :key="data.id" :title="data.title" :author-name="data.author?.name" :created-at="data.createdAt" />
    <div v-element-visibility="loadMore" class="w-full h-px" />
  </div>
</template>
