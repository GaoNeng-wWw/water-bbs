<script setup lang="ts">
import { AppNavBar, TopicList } from '@/components/app';
import Categoies from './components/categories.vue';
import { UiShadowScroll } from '@/components/ui';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TopicListSkeleton from '@/components/app/topic/topic-list.skeleton.vue';
import type { CategoryInfo } from '@/api';
import CategoriesSkeleton from './components/categories.skeleton.vue';

const router = useRouter();
const route = useRoute();

const category = ref<CategoryInfo | null>(null);

watch(category, () => {
  if (category.value) {
    router.replace({ path: `/${category.value.id}` });
  }
});
</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="max-w-5xl flex flex-col mx-auto pt-8 pb-4 gap-8 px-5">
      <div class="w-full">
        <h1 class="text-3xl text-surface-fg">
          {{ category?.name }}
        </h1>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="w-full">
          <suspense>
            <topic-list v-if="category" :category="{ ...category }" />
            <template #fallback>
              <topic-list-skeleton />
            </template>
          </suspense>
        </div>
        <div class="w-full shrink-0 h-fit -order-1 top-16 static space-y-4 md:sticky md:order-1 md:w-75">
          <div class="w-full h-fit bg-surface-100 rounded-md border border-surface-200 p-2">
            <div class="mb-4 text-surface-fg/50">
              <span>分类</span>
            </div>
            <ui-shadow-scroll class="h-75">
              <suspense :timeout="300">
                <categoies v-model="category" />
                <template #fallback>
                  <categories-skeleton />
                </template>
              </suspense>
            </ui-shadow-scroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
