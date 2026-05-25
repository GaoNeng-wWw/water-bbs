<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import { UiButton } from '../button';

const { src } = defineProps<{ src: string }>();

const emits = defineEmits<{
  done: [Blob];
  close: [Blob | null];
}>();

const cropperRef = useTemplateRef('cropper');
const onClickDone = () => {
  if (!cropperRef.value) {
    return;
  }
  const result = cropperRef.value.getResult();
  const canvas = result.canvas;
  if (!canvas) {
    return;
  }
  canvas.toBlob((blob) => {
    emits('close', blob);
    if (!blob) {
      return;
    }
    emits('done', blob);
  }, 'image/webp', 1);
};
</script>

<template>
  <div class="w-full min-h-300px space-y-4">
    <cropper ref="cropper" :src="src" :stencil-component="CircleStencil" />
    <div class="w-full mx-auto">
      <ui-button shape="solid" color="primary" full @click="onClickDone">
        Done
      </ui-button>
    </div>
  </div>
</template>
