<script setup lang="ts">
import { useSiteStore } from '@/store/site.store';
import ThreadItem from './thread-item.vue';
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
const { setPostTitle, setHeaderTitleVisbility } = useSiteStore();

setPostTitle('Post Title');

const title = useTemplateRef('title');

const onScroll = () => {
  const rect = title.value?.getBoundingClientRect();
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
  document.addEventListener('scroll', onScroll);
});
onUnmounted(() => {
  document.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div class="w-full mx-auto">
    <div class="w-full h-fit bg-warm-50">
      <div class="w-full">
        <h1 ref="title" class="text-3xl text-warm-foreground font-bold mb-5">
          Post Title
        </h1>
      </div>
    </div>
    <div class="w-full flex flex-col">
      <thread-item />
      <thread-item />
      <thread-item />
    </div>
  </div>
</template>
