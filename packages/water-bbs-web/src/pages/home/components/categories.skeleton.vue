<script setup lang="ts">
import { UiSkeleton } from '@/components/ui';
</script>

<template>
  <div class="w-full text-surface-fg space-y-3">
    <div v-for="i, idx in Array.from({ length: 10 }).fill(true)" :key="idx" class="w-full flex gap-3 items-center">
      <ui-skeleton rounded="full" class="size-6! shrink-0" animated />
      <ui-skeleton class="flex-1 h-8!" animated />
    </div>
  </div>
</template>
