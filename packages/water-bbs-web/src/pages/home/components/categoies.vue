<script setup lang="ts">
import { UiListbox, UiListboxItem, UiListboxSection } from '@/components/ui';
import { ref, watch } from 'vue';

export type CategoryItem = {
  color?: string;
  label: string;
  id: string;
};

const { categories } = defineProps<{
  categories: CategoryItem[];
}>();

const modelValue = defineModel<string>({ required: true });

const selected = ref([modelValue.value]);

watch(selected, () => {
  modelValue.value = selected.value[0];
});
</script>

<template>
  <div class="w-full text-surface-fg">
    <ui-listbox v-model="selected">
      <ui-listbox-section>
        <ui-listbox-item
          v-for="category of categories"
          :id="category.id"
          :key="category.id"
          :value="category.id"
          class="flex items-center gap-2"
        >
          <div class="rounded-full size-component-xs bg-(--color)" :style="{ '--color': category.color ?? 'var(--color-surface-500)' }" />
          {{ category.label }}
        </ui-listbox-item>
      </ui-listbox-section>
    </ui-listbox>
  </div>
</template>
