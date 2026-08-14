<script setup lang="ts">
import { h } from 'vue';
import replyCardSkeleton from './reply-card.skeleton.vue';

const { size = 20 } = defineProps<{ size?: number }>();

const skeleton = Array.from({ length: size }).fill(
  h(replyCardSkeleton),
);
</script>

<template>
  <div class="w-full flex flex-col">
    <component :is="comp" v-for="comp, idx of skeleton" :key="idx" />
  </div>
</template>
