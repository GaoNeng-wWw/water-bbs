<script setup lang="ts">
import { UiSkeletion } from '@/components/ui';
import ThreadItemSkeleton from './thread-item.skeleton.vue';
</script>

<template>
  <div class="w-full mx-auto">
    <div class="w-full h-fit bg-warm-50">
      <div class="w-full">
        <ui-skeletion class="w-full h-8" />
      </div>
    </div>
    <div class="w-full flex flex-col gap-4">
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
      <thread-item-skeleton />
    </div>
  </div>
</template>
