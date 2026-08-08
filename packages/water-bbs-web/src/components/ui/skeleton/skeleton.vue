<script lang="ts" setup>
import { computed } from 'vue';
import type { SkeletonProps } from './skeleton.props';
import { skeletonStyle } from './style';

const { width, height, ...themeProps } = defineProps<SkeletonProps>();

const style = computed(() => skeletonStyle(themeProps));

const customStyle = computed(() => ({
  width: width,
  height: height,
}));
</script>

<template>
  <div :class="style" :style="customStyle" />
</template>
