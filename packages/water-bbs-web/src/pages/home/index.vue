<script setup lang="ts">
import { AppNavBar, Category, TopicList } from '@/components/app';
import { UiShadowScroll, UiSkeleton } from '@/components/ui';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TopicListSkeleton from '@/components/app/topic/topic-list.skeleton.vue';
import { findCategory } from '@/api';
import { useCategoryList } from '@/composables';
import { useQuery } from '@tanstack/vue-query';
import CategoriesSkeleton from './components/categories.skeleton.vue';

const router = useRouter();
const route = useRoute();
const { data } = useCategoryList();

const activeId = ref(route.params.id?.toString() ?? '');
const { data: category, isLoading } = useQuery({
  queryKey: ['categoryId', activeId],
  queryFn: () => {
    return findCategory({
      path: { id: activeId.value },
    }).then(resp => resp.data);
  },
});

watch(activeId, () => {
  if (activeId.value) {
    router.replace(`/${activeId.value}`);
  }
});
</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="max-w-5xl flex flex-col mx-auto pt-8 pb-4 gap-8 px-5">
      <div class="w-full">
        <h1 v-if="!isLoading" class="text-3xl text-surface-fg">
          {{ category?.name }}
        </h1>
        <ui-skeleton v-else class="w-64! h-3" animated />
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="w-full">
          <div v-if="!isLoading">
            <suspense>
              <topic-list v-if="category" :category="{ ...category }" />
              <template #fallback>
                <topic-list-skeleton />
              </template>
            </suspense>
          </div>
          <topic-list-skeleton v-else />
        </div>
        <div class="w-full shrink-0 h-fit -order-1 top-16 static space-y-4 md:sticky md:order-1 md:w-75">
          <div class="w-full h-fit bg-surface-100 rounded-md border border-surface-200 p-2">
            <div class="mb-4 text-surface-fg/50">
              <span>分类</span>
            </div>
            <ui-shadow-scroll class="h-75">
              <Category.List v-if="!isLoading" v-model="activeId" :items="data" show-color />
              <categories-skeleton v-else />
            </ui-shadow-scroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
