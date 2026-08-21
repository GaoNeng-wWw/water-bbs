<script lang="ts" setup>
import { UiShadowScroll, UiSkeleton } from '@/components/ui';
</script>

<template>
  <ui-shadow-scroll class="w-full h-40">
    <div class="w-full space-y-2">
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
      <ui-skeleton class="w-full h-4!" rounded="full" animated />
    </div>
  </ui-shadow-scroll>
</template>
