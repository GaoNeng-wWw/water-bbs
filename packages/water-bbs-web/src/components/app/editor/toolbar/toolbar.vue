<script lang="ts" setup>
import { computed } from 'vue';
import type { ToolbarItem } from './type';
import { render } from './render';
import type { Editor } from '@tiptap/vue-3';

const props = defineProps<{
  items: ToolbarItem[];
  editor: Editor;
}>();

const components = computed(() => {
  return props.items.map((item) => {
    return render(item, props.editor);
  });
});
</script>

<template>
  <div class="w-full flex">
    <component :is="comp" v-for="comp, idx of components" :key="idx" />
  </div>
</template>
