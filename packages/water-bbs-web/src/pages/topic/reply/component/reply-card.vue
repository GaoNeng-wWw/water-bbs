<script lang="ts" setup>
import { UiAvatar } from '@/components/ui';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import replyCardToolbar from './reply-card-toolbar.vue';
import { useToggle } from '@vueuse/core';
import { motion, AnimatePresence } from 'motion-v';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { createCommentReply, getCommentByResourceId } from '@/api';
import { CommentList, CommentEditor } from '@/components/app';
import { ref } from 'vue';

const props = defineProps<{
  id: string;
  content: string;
  authorName: string;
  authorId: string;
}>();

const editor = useEditor({
  editable: false,
  extensions: [StarterKit, Markdown.configure({
    markedOptions: {
      gfm: true,
      async: true,
      pedantic: true,
    },
    indentation: {
      style: 'space',
    },
  })],
  content: props.content,
  contentType: 'markdown',
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert',
    },
  },
});

const [commentVisiblity, toggleCommentVisbility] = useToggle(false);

const client = useQueryClient();

const { data } = useQuery({
  queryFn: () => {
    return getCommentByResourceId({
      path: {
        resourceID: props.id,
      },
    })
      .then(resp => resp.data);
  },
  queryKey: ['comments', 'resource-id', props.id],
  gcTime: 5 * 60 * 1000,
  staleTime: 60 * 1000,
});
const loading = ref(false);
const onSubmit = (content: string, commentId: string) => {
  loading.value = true;
  createCommentReply({
    path: {
      commentId,
    },
    body: {
      content,
    },
  })
    .then(() => {
      return client.invalidateQueries(() => {
        return {
          queryKey: ['comments', 'resource-id', props.id],
        };
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <div
    class="
      w-full p-4 space-y-4 border-x border-b border-surface-200
      pb-8
      first:border-t
    "
  >
    <div class="w-full flex justify-between items-center">
      <div class="w-fit flex items-center gap-2">
        <ui-avatar size="sm" url="https://placehold.co/32" fallback-text="" />
        <span class="text-md text-surface-fg">{{ props.authorId }}</span>
      </div>
    </div>
    <div class="w-full h-fit" @click.stop.prevent>
      <editor-content :editor="editor" />
    </div>
    <reply-card-toolbar @comment-click="toggleCommentVisbility" />
    <animate-presence>
      <motion.div
        v-show="commentVisiblity"
        class="overflow-hidden"
        :initial="{ height: '0', opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: '0', opacity: 0 }"
      >
        <comment-editor v-if="data" :loading="loading" :cancel="false" @submit="(content) => onSubmit(content, data!.id)" />
        <comment-list v-if="data" :comment-id="data.id" :size="20" />
      </motion.div>
    </animate-presence>
  </div>
</template>
