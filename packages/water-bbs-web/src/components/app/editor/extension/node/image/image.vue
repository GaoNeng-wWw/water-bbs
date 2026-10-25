<script lang="ts" setup>
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3';
import { computed } from 'vue';

const props = defineProps<NodeViewProps>();

const uploading = computed(() => props.node.attrs.uploading);
</script>

<template>
  <node-view-wrapper>
    <div class="w-full h-50">
      <div v-if="uploading" class="w-full h-full flex items-center justify-center">
        <span>Loading....</span>
      </div>
      <img class="size-full rounded-md" v-bind="props.node.attrs">
    </div>
  </node-view-wrapper>
</template>
