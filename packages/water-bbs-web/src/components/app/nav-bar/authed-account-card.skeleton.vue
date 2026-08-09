<script setup lang="ts">
import { UiSkeleton } from '@/components/ui';
</script>

<template>
  <div class="w-full flex gap-3">
    <ui-skeleton class="shrink! h-form-md aspect-video" />
    <ui-skeleton class="h-form-md! w-form-md! shrink-0" rounded="full" animated />
  </div>
</template>
