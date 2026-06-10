<script setup lang="ts">
import { useSiteStore } from '@/store/site.store';
import ThreadItem from './thread-item.vue';
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
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
const router = useRouter();
const curPage = ref(1);

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
watch(curPage, () => {
  if (curPage.value <= 0) {
    return;
  }
  loadPost(curPage.value);
}, { immediate: true });
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
      <div class="w-full h-fit flex items-baseline gap-3 border-t border-x border-warm-200/50">
        <div class="w-full flex gap-3 min-h-16">
          <div class="w-193px border-r border-warm-200/50 shrink-0 hidden md:block" />
          <div class="w-full py-3 px-6 md:px-0">
            <h1 ref="title" class="text-3xl text-warm-foreground font-bold my-auto line-clamp-2">
              {{ title }}
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col">
      <thread-item
        v-for="thread in threads"
        :key="thread.id"
        :author-name="thread.author.name"
        :author-avatar="thread.author.avatar"
        :content="thread.content"
        :created-at="thread.createdAt"
        :floor="thread.floor"
      />
    </div>
    <div class="my-4">
      <ui-pagination v-if="total" v-model="curPage" :total="total" />
    </div>
  </div>
</template>
