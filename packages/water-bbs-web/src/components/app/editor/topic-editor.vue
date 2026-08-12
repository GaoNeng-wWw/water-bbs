<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';

const editor = useEditor({
  autofocus: true,
  editorProps: {
    attributes: {
      class: 'size-full outline-none prose dark:prose-invert',
    },
  },
  extensions: [
    StarterKit,
    Markdown.configure({
      markedOptions: {
        gfm: true,
        breaks: true,
        pedantic: false,
      },
    }),
  ],
  editable: true,
});

const getContent = () => editor.value?.getMarkdown() ?? '';

defineExpose({ getContent });
</script>

<template>
  <div class="w-full h-full rounded-m border border-surface-200 p-4">
    <editor-content :editor="editor" />
  </div>
</template>
