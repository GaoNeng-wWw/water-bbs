<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';

const editor = useEditor({
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
</script>

<template>
  <div class="w-full h-full p-4">
    <slot name="toolbar" :editor="editor" />
    <editor-content :editor="editor" />
  </div>
</template>
