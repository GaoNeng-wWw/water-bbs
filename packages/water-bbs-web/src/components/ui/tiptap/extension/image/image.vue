<script lang="ts" setup>
import { UiImage } from '@/components/ui/image';
import type { NodeViewProps } from '@tiptap/vue-3';
import { NodeViewWrapper } from '@tiptap/vue-3';
import { computed } from 'vue';

const { node, editor } = defineProps<NodeViewProps>();

const src = computed(() => node.attrs.src);
const alt = computed(() => node.attrs.alt);
const lazy = computed(() => node.attrs.lazy);
const width = computed(() => node.attrs.width);
const height = computed(() => node.attrs.height);
</script>

<template>
  <node-view-wrapper>
    <div class="w-full flex justify-center">
      <ui-image
        :src="src"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        :width="width"
        :height="height" class="max-w-full"
        :lightbox="!editor.isEditable"
      />
    </div>
  </node-view-wrapper>
</template>

<style scoped>
img.ProseMirror-selectedNode {
  outline: 2px solid var(--colors-primary-500);
}
</style>
