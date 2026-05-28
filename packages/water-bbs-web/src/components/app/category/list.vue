<script lang="ts" setup>
import { UiCollapse } from '@/components/ui';
import { useCategoryTree } from '@/composables';
import { useSiteStore } from '@/store/site.store';
const { roots, expand, onActive } = useCategoryTree();
const { setActiveCategory } = useSiteStore();

expand();
onActive((node) => {
  setActiveCategory(node.id);
});
</script>

<template>
  <div class="w-full">
    <ui-collapse>
      <component :is="item" v-for="item in roots" :key="item.key" />
    </ui-collapse>
  </div>
</template>
