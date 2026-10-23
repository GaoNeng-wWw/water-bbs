<script setup lang="ts">
import { UiSkeleton } from '@/components/ui';
</script>

<template>
  <div class="w-full flex justify-between">
    <ui-skeleton
      class="w-32! h-form-md! px-component-md! rounded-md! shrink-0!"
      animated
    />
    <ui-skeleton
      class="w-64! h-form-md! px-component-md! rounded-md! shrink-0!"
      animated
    />
  </div>
</template>
