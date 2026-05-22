<script lang="ts" setup>
import { UiSkeletion } from '@/components/ui';
</script>

<template>
  <div class="size-full">
    <div class="flex py-4 gap-3">
      <ui-skeletion class="size-12 shrink-0" rounded="full" />
      <div class="min-w-0 w-full grow flex flex-col gap-2">
        <div class="size-full flex flex-col justify-around gap-2">
          <ui-skeletion class="w-full h-16" />
          <ui-skeletion class="w-full h-16" />
          <ui-skeletion class="w-full h-32" />
          <ui-skeletion class="w-full h-16" />
          <ui-skeletion class="w-full h-32" />
        </div>
      </div>
    </div>
  </div>
</template>
