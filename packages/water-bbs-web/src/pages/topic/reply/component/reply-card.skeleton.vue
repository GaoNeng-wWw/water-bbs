<script lang="ts" setup>
import { UiSkeleton } from '@/components/ui';
</script>

<template>
  <div
    class="
      w-full p-4 space-y-4 border-x border-b border-surface-200
      pb-8
      first:border-t
    "
  >
    <div class="w-full flex justify-between items-center">
      <div class="w-fit flex items-center gap-2">
        <ui-skeleton class="avatar-md!" rounded="full" animated />
        <ui-skeleton width="64px" height="16px" animated/>
      </div>
      <ui-skeleton width="36px" height="36px" animated />
    </div>
    <div class="w-full h-fit space-y-4">
      <ui-skeleton class="w-full! h-3! rounded-full" animated />
      <ui-skeleton class="w-full! h-3! rounded-full" animated />
      <ui-skeleton class="w-full! h-3! rounded-full" animated />
      <ui-skeleton class="w-1/2! h-3! rounded-full" animated />
    </div>
  </div>
</template>
