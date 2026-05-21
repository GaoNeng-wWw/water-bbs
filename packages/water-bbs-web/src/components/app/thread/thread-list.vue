<script setup lang="ts">
import { useSiteStore } from '@/store/site.store';
import ThreadItem from './thread-item.vue';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
const {postId,title} = defineProps<{
  postId: string;
  title: string;
}>();

const { setPostTitle, setHeaderTitleVisbility } = useSiteStore();

setPostTitle(title);

const titleInstance = useTemplateRef('title');

const posts = ref([]);

const onScroll = () => {
  console.log('trigger');
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
      <div class="w-full">
        <h1 ref="title" class="text-3xl text-warm-foreground font-bold mb-5">
          {{ title }}
        </h1>
      </div>
    </div>
    <div class="w-full flex flex-col">
      <!-- <thread-item :author-name="" /> -->
    </div>
  </div>
</template>
