<script lang="ts" setup>
import { UiSkeleton } from '@/components/ui';

export type TopicCardProps = {
  author: boolean;
};
const {
  author,
} = defineProps<TopicCardProps>();
</script>

<template>
  <div class="w-full p-4 rounded-xl space-y-2">
    <div class="pl-1 space-y-2">
      <div class="w-full flex gap-2">
        <ui-skeleton class="w-12! h-4.5! rounded-full" animated />
        <ui-skeleton class="w-12! h-4.5! rounded-full" animated />
      </div>
      <ui-skeleton class="w-full! h-4.5! rounded-full" animated />
      <ui-skeleton class="w-full! h-4.5! rounded-full" animated />
    </div>
    <div v-if="author" class="w-full flex items-center shrink-0 gap-2">
      <ui-skeleton class="size-avatar-sm aspect-square grow-0! w-fit!" rounded="full" animated />
      <div class="grow space-y-3">
        <ui-skeleton class="flex-1 h-3!" animated />
        <ui-skeleton class="flex-1 h-3!" animated />
      </div>
    </div>
  </div>
</template>
