<script lang="ts" setup>
import { UiAvatar, UiTiptapEditor } from '@/components/ui';

const {
  authorName,
  authorAvatar,
  createdAt,
  content,
  floor,
} = defineProps<{
  authorName: string; createdAt: string; content: object; floor: number;
  authorAvatar: string;
}>();
</script>

<template>
  <div class="group w-full">
    <div class="flex flex-col relative border-b border-x border-warm-200/50 group-first:border-t px-4 gap-0 md:flex-row md:px-0 md:gap-3">
      <div class="w-full h-fit py-3 flex gap-3 items-center sticky z-5 bg-warm-50 shrink-0 top-15 md:flex-col md:w-180px md:min-h-200px md:top-20">
        <ui-avatar
          :avatar-url="authorAvatar"
          size="lg"
          :username="authorName"
          class="sticky hidden md:block"
        />
        <ui-avatar
          :avatar-url="authorAvatar"
          size="md"
          :username="authorName"
          class="sticky md:hidden"
        />
        <div class="flex flex-col justify-evenly text-warm-foreground h-18 grow md:grow-0 md:h-auto">
          <p class="text-sm text-warm-foreground text-start md:text-center ">
            {{ authorName }}
          </p>
          <p class="text-xs text-warm-foreground/60 block md:hidden">
            {{ createdAt }}
          </p>
        </div>
      </div>
      <div class="p-3 border-warm-200/50 min-w-0 w-full grow flex flex-col gap-2 md:border-l">
        <div class="w-full text-warm-foreground">
          <ui-tiptap-editor :content="content" readonly />
        </div>
      </div>
    </div>
  </div>
</template>
