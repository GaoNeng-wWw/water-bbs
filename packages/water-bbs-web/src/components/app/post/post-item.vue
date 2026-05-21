<script lang="ts" setup>
const {title, id, authorName, createdAt} = defineProps<{
  title: string;
  id: string;
  authorName: string;
  createdAt: string
}>();
</script>

<template>
  <div class="w-full h-fit py-3 border-b border-warm-200 flex gap-2 text-warm-foreground">
    <div class="size-12 bg-red shrink-0 rounded-full" />
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
