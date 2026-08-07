<script lang="ts" setup>
import { AppNavBar } from '@/components/app';
import ReplyCardList from './component/reply-card-list.vue';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const postTitle = useTemplateRef('post-title');
const router = useRouter();

const page = ref(router.currentRoute.value.query.page ? Number(router.currentRoute.value.query.page) : 1);
const opacity = ref(0);
const blur = ref('0');

const onScroll = (ev: Event) => {
  const el = postTitle.value;
  if (!el) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const rawBlur = rect.y / rect.height;
  const op = (1 - rect.y / rect.height);
  opacity.value = op > 1 ? 1 : op < 0 ? 0 : op;
  blur.value = `${rawBlur}px`;
};

const onPageUpdate = (page: number) => {
  router.push({ path: router.currentRoute.value.path, query: { page }, replace: true });
};

watch(router.currentRoute, () => {
  if (router.currentRoute.value.query.page && !Number.isNaN(Number.parseInt(router.currentRoute.value.query.page.toString()))) {
    page.value = Number.parseInt(router.currentRoute.value.query.page.toString());
  } else {
    page.value = 1;
  }
}, { immediate: true, deep: true });

onMounted(() => {
  document.getRootNode().addEventListener('scroll', onScroll);
});
</script>

<template>
  <div class="w-full">
    <app-nav-bar>
      <template #main>
        <div class="size-full flex items-center justify-center">
          <span
            class="text-3xl text-surface-fg opacity-(--opacity)"
            :style="{ '--opacity': opacity }"
          >Title</span>
        </div>
      </template>
    </app-nav-bar>
    <div class="max-w-5xl mx-auto py-4 px-2">
      <div class="w-full">
        <div class="w-full bg-bg border-x border-t border-surface-200 p-4 rounded-t-lg">
          <h1 ref="post-title" class="text-3xl text-surface-fg">
            Title
          </h1>
        </div>
        <reply-card-list
          v-model="page"
          @update:model-value="onPageUpdate"
        />
      </div>
    </div>
  </div>
</template>
