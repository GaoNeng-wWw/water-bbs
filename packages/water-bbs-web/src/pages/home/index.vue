<script setup lang="ts">
import { AppNavBar, TopicList } from '@/components/app';
import Categoies, { type CategoryItem } from './components/categoies.vue';
import { UiShadowScroll } from '@/components/ui';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TopicListSkeleton from '@/components/app/topic/topic-list.skeleton.vue';

const categories: CategoryItem[] = [
  { id: 'c1', label: '前端', color: '#3b82f6' },
  { id: 'c2', label: 'Vue', color: '#10b981' },
  { id: 'c3', label: '后端', color: '#f59e0b' },
  { id: 'c4', label: 'Node.js', color: '#22c55e' },
  { id: 'c5', label: '全栈', color: '#8b5cf6' },
  { id: 'c6', label: 'DevOps', color: '#ef4444' },
  { id: 'c7', label: 'TypeScript', color: '#3178c6' },
  { id: 'c8', label: '数据库', color: '#06b6d4' },
  { id: 'c9', label: 'Rust', color: '#f97316' },
  { id: 'c10', label: '讨论', color: '#a855f7' },
  { id: 'c11', label: '性能', color: '#eab308' },
  { id: 'c12', label: 'Git', color: '#f05032' },
  { id: 'c13', label: 'CSS', color: '#2563eb' },
  { id: 'c14', label: 'Go', color: '#00add8' },
  { id: 'c15', label: '工程化', color: '#6366f1' },
  { id: 'c16', label: 'API', color: '#14b8a6' },
  { id: 'c17', label: '安全', color: '#dc2626' },
  { id: 'c18', label: 'K8s', color: '#326ce5' },
];

const router = useRouter();
const route = useRoute();

const categoryId = ref(route.params.id?.toString() || categories[0].id);
const activeCategory = computed(() => categories.filter(c => c.id === categoryId.value)[0]);

watch(categoryId, () => {
  router.replace({ path: `/${categoryId.value}` });
});
</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="max-w-5xl flex flex-col mx-auto pt-8 pb-4 gap-8 px-5">
      <div class="w-full">
        <h1 class="text-3xl text-surface-fg">
          {{ activeCategory.label }}
        </h1>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="w-full">
          <suspense>
            <topic-list :category="{ ...activeCategory, name: activeCategory.label }" />
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
              <categoies v-model="categoryId" :categories="categories" />
            </ui-shadow-scroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
