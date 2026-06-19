<script lang="ts" setup>
import { UiAvatar, UiTiptapEditor, UiButton } from '@/components/ui';
import type { ProposalComment } from '@/api';
import { useTemplateRef } from 'vue';

const {
  comments,
} = defineProps<{
  comments: ProposalComment[];
  loading?: boolean;
}>();

const emits = defineEmits<{
  submit: [string];
}>();
const editor = useTemplateRef('editor');
const onClickSubmit = async () => {
  if (!editor.value) {
    return;
  }
  await editor.value.coverImage();
  const content = editor.value.getMd();
  emits('submit', content);
};
</script>

<template>
  <div class="w-full relative space-y-4">
    <div class="w-full p-2 bg-warm-100">
      <div class="w-full h-48">
        <ui-tiptap-editor ref="editor" class="overflow-auto h-full" />
      </div>
      <ui-button shape="solid" color="primary" @click="onClickSubmit">
        Submit
      </ui-button>
    </div>
    <div class="w-full py-4 px-2 bg-warm-100 rounded-md space-y-4">
      <div v-for="comment of comments" :key="comment.commentId" class="w-full flex min-w-0 gap-4">
        <div class="size-fit shrink-0 grow-0">
          <ui-avatar :avatar-url="comment.author.avatar" :username="comment.author.nick" size="sm" />
        </div>
        <div class="shrink grow">
          <p class="text-warm-foreground">
            {{ comment.author.nick }}
          </p>
          <ui-tiptap-editor :content="comment.content" content-type="markdown" readonly />
        </div>
      </div>
    </div>
  </div>
</template>
