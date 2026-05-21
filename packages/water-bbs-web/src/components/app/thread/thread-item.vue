<script lang="ts" setup>
import { UiTiptapEditor } from '@/components/ui';

const {
  authorName,
  createdAt,
  content
} = defineProps<{authorName: string, createdAt: string, content: object}>();
</script>

<template>
  <div class="w-full">
    <div class="flex py-4 gap-3">
      <div class="size-12 bg-red rounded-full shrink-0 sticky top-0" />
      <div class="min-w-0 w-full grow flex flex-col gap-2">
        <div class="w-full">
          <p class="text-warm-foreground text-sm">
            {{ authorName }}
          </p>
          <p class="text-sm text-warm-foreground/50">
            {{ createdAt }}
          </p>
        </div>
        <div class="w-full text-warm-foreground">
          <ui-tiptap-editor :content="content" readonly />
        </div>
      </div>
    </div>
    <hr class="w-full text-warm-foreground/20">
  </div>
</template>
