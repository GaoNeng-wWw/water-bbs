<script setup lang="ts">
import { listCategory, type CategoryInfo } from '@/api';
import { UiListbox, UiListboxItem, UiListboxSection } from '@/components/ui';
import { useOffsetPagination } from '@vueuse/core';
import { reactive, ref, watch } from 'vue';

const modelValue = defineModel<CategoryInfo | null>({ required: true });

const selected = ref([modelValue.value?.id as unknown as string]);

const categories = ref<CategoryInfo[]>([]);

watch(selected, () => {
  modelValue.value = categories.value.filter(category => selected.value.includes((category.id as unknown as string)))[0] ?? null;
});

const fetchState = reactive({ done: false, loading: false });

const { currentPage, currentPageSize, next } = useOffsetPagination({});

const load = (page: number, size: number) => {
  if (fetchState.done || fetchState.loading) {
    return Promise.resolve([]);
  }
  fetchState.loading = true;
  return listCategory({ query: { page, size } })
    .then(resp => resp.data)
    .then(data => data?.data as CategoryInfo[] ?? [])
    .then((data) => {
      if (!data.length) {
        fetchState.done = true;
        return [];
      }
      categories.value.push(...data);
      return data;
    })
    .finally(() => {
      fetchState.loading = false;
    });
};

const loadMore = () => {
  if (fetchState.done || fetchState.loading) {
    return;
  }
  next();
  loadMore();
};

load(currentPage.value, currentPageSize.value)
  .then(infos => selected.value = [infos[0]?.id as unknown as string]);
</script>

<template>
  <div class="w-full text-surface-fg">
    <ui-listbox v-model="selected">
      <ui-listbox-section>
        <ui-listbox-item
          v-for="category of categories"
          :id="category.id as unknown as string"
          :key="category.id as unknown as string"
          :value="category.id as unknown as string"
          class="flex items-center gap-2"
        >
          <div class="rounded-full size-component-xs bg-(--color)" :style="{ '--color': category.color ?? 'var(--color-surface-500)' }" />
          {{ category.name }}
        </ui-listbox-item>
      </ui-listbox-section>
    </ui-listbox>
  </div>
</template>
