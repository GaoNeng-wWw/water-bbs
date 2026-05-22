<script setup lang="ts">
import { useSiteStore } from '@/store/site.store';
import ThreadItem from './thread-item.vue';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { postControllerGetThread, type Thread } from '@/api';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { useRouter } from 'vue-router';
import { UiPagination } from '@/components/ui';
const { postId, title } = defineProps<{
  postId: string;
  title: string;
}>();

const { setPostTitle, setHeaderTitleVisbility } = useSiteStore();

setPostTitle(title);

const titleInstance = useTemplateRef('title');

const threads = ref<Thread[]>([]);
const total = ref<number | null>(null);
const SIZE = 10;
const totalPage = computed(() => total.value ? Math.ceil(total.value / SIZE) : 1);
const router = useRouter();

const onScroll = () => {
  const rect = titleInstance.value?.getBoundingClientRect();
  if (!rect) {
    return;
  }
  const { top } = rect;
  if (top / 96 < 0) {
    return;
  }
  setHeaderTitleVisbility(
    1 - (top / 96) > 0.5,
  );
};

const loadPost = (page: number = 1) => {
  return postControllerGetThread({
    path: { id: postId },
    client: NOT_PUBLIC_ENDPOINT,
    query: {
      page,
      size: 10,
    },
  })
    .then(resp => resp.data)
    .then((data) => {
      if (!data) {
        return;
      }
      threads.value = data.data as Thread[];
      total.value = data.total;
    });
};
await loadPost();
onMounted(() => {
  onScroll();
  document.body.addEventListener('scroll', onScroll);
});
onUnmounted(() => {
  document.body.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div class="w-full mx-auto">
    <div class="w-full h-fit bg-warm-50">
      <div class="w-full flex items-baseline  mb-5 gap-4">
        <div class="cursor-pointer size-4 text-warm-foreground i-material-symbols:arrow-back-ios-new" @click="router.back()" />
        <h1 ref="title" class="text-3xl text-warm-foreground font-bold">
          {{ title }}
        </h1>
      </div>
    </div>
    <ui-pagination />
    <div class="w-full flex flex-col">
      <thread-item
        v-for="thread in threads"
        :key="thread.id"
        :author-name="thread.author.name"
        :content="JSON.parse(thread.content)"
        :created-at="thread.createdAt"
      />
    </div>
  </div>
</template>
