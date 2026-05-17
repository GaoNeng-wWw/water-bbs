<script lang="ts" setup>
import { UiCollapse } from '@/components/ui';
import { useCategoryTree } from '@/composables';
const { roots, expand } = useCategoryTree();

expand();
</script>

<template>
  <div class="w-full px-2">
    <ui-collapse>
      <component :is="item" v-for="item in roots" :key="item.key" />
    </ui-collapse>
  </div>
</template>
