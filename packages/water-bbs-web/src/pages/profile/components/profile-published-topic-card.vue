<script lang="ts" setup>
import dayjs from 'dayjs';

import { computed } from 'vue';

export type CategoryInfo = { color?: string; name: string; id: string };
export type ProfilePublishedTopicCardProps = {
  title: string;
  category: CategoryInfo;
  id: string;
  createdAt: string;
  repliesTotal: number;
};
const {
  title,
  id,
  createdAt,
  repliesTotal,
  category,
} = defineProps<ProfilePublishedTopicCardProps>();

const friendlyCreatedAt = computed(() => dayjs(createdAt).fromNow());
</script>

<template>
  <div class="w-full border border-solid border-surface-200 p-4 rounded-xl bg-surface-100">
    <div class="w-full flex gap-2 flex-wrap mb-3">
      <div :key="category.id" class="px-2 py-0.5 text-xs bg-surface-200 rounded-full flex items-center gap-2 text-surface-fg">
        <div class="size-component-sm rounded-full bg-(--color)" :style="{ '--color': category.color ?? 'var(--color-primary-500)' }" />
        {{ category.name }}
      </div>
    </div>
    <div class="flex gap-2 items-center flex-wrap pl-1">
      <router-link :to="`/topic/${id}`" class="text-lg text-surface-fg font-bold">
        {{ title }}
      </router-link>
      <span class="text-sm text-surface-fg/20">{{ friendlyCreatedAt }}</span>
    </div>
    <div class="w-full mt-4 pl-1">
      <div class="w-fit flex items-center justify-center gap-1">
        <i class="icon-[material-symbols--mode-comment-outline] size-component-sm text-surface-fg/60" />
        <span class="text-sm text-surface-fg/80 font-bold">{{ repliesTotal }}</span>
      </div>
    </div>
  </div>
</template>
