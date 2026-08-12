<script lang="ts" setup>
import dayjs from 'dayjs';
import { UiAvatar } from '@/components/ui';
import { computed } from 'vue';

export type CategoryInfo = { color?: string; name: string; id: string };
export type Author = {
  id: string;
  nick: string;
};
export type TopicCardProps = {
  title: string;
  category: CategoryInfo;
  id: string;
  createdAt: string;
  repliesTotal: number;
  author?: Author;
  pin?: boolean;
};
const {
  title,
  id,
  createdAt,
  repliesTotal,
  category,
  author,
} = defineProps<TopicCardProps>();

const friendlyCreatedAt = computed(() => dayjs(createdAt).fromNow())
</script>

<template>
  <div class="w-full border border-solid border-surface-200 p-4 rounded-xl bg-surface-100">
    <div class="w-full flex gap-2 flex-wrap mb-3">
      <div v-if="pin" class="icon-[mdi--pin-outline] size-5 text-surface-fg" />
      <div :key="category.id" class="px-2 py-0.5 text-xs bg-surface-200 rounded-full flex items-center gap-2 text-surface-fg">
        <div class="size-component-sm rounded-full bg-(--color)" :style="{ '--color': category.color ?? 'var(--color-primary-500)' }" />
        {{ category.name }}
      </div>
    </div>
    <div class="flex gap-2 items-center flex-wrap pl-1">
      <router-link :to="`/topic/${id}`" class="text-lg text-surface-fg font-bold">
        {{ title }}
      </router-link>
    </div>
    <div class="w-full mt-4 pl-1 flex justify-between">
      <div v-if="author" class="w-fit flex items-center shrink-0">
        <div class="w-fit shrink-0 flex items-center gap-2">
          <ui-avatar size="sm" :fallback-text="author.nick" url="" />
          <router-link :to="{path: `/profile/${author.id}` }" class="text-nowrap">
            <span class="text-sm shrink-0 text-surface-800">{{ author.nick }}</span>
          </router-link>
        </div>
      </div>
      <div class="w-fit flex items-center justify-center gap-1">
        <div class="w-fit flex items-center justify-center gap-1">
          <i class="icon-[material-symbols--mode-comment-outline] size-component-sm text-surface-fg/60" />
          <span class="text-sm text-surface-fg/80 font-bold">{{ repliesTotal }}</span>
        </div>
        <span class="ml-4 text-xs text-surface-fg/20">{{ friendlyCreatedAt }}</span>
      </div>
    </div>
  </div>
</template>
