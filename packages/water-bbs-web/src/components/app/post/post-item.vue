<script lang="ts" setup>
import { UiAvatar } from '@/components/ui';

const {title, id, authorName, authorId, authorAvatar, createdAt} = defineProps<{
  title: string;
  id: string;
  authorName: string;
  createdAt: string;
  authorId: string;
  authorAvatar: string;
}>();
</script>

<template>
  <div class="w-full h-fit py-3 border-b border-warm-200/50 flex gap-2 text-warm-foreground">
    <ui-avatar :avatar-url="authorAvatar" :username="authorName" size="sm" />
    <div>
      <router-link
        class="text-base cursor-pointer hover:text-primary-500"
        :to="`/post/${id}`"
      >
        {{ title }}
      </router-link>
      <div class="w-full flex items-center mt-1 text-xs space-x-4">
        <span>{{ authorName }}</span>
        <span>{{ createdAt }}</span>
      </div>
    </div>
  </div>
</template>
