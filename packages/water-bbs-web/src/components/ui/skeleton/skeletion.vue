<script lang="ts" setup>
const { rounded = 'md' } = defineProps<{
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}>();
</script>

<template>
  <div
    :data-rounded="rounded"
    class="
      data-[rounded='sm']:rounded-sm data-[rounded='md']:rounded data-[rounded='lg']:rounded-lg data-[rounded='full']:rounded-full
      after:bg-warm-100 shimmer
    "
  />
</template>

<style scoped>
.shimmer {
  position: relative;
  overflow: hidden;
}
.shimmer::after {
  display: block;
  content: '';
  width: 100%;
  height: 100%;
  animation: shimmerAnimate 3s infinite alternate-reverse;
}
@keyframes shimmerAnimate {
  50%  { opacity: 0.5 }
  100% { opacity: 1 }
}
</style>
