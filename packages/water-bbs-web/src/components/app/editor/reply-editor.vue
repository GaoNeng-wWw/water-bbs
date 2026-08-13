<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';

const props = defineProps<{
  placeholder?: string;
  content?: string;
}>();

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'size-full max-w-full outline-none prose prose:max-w-full dark:prose-invert',
    },
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    Markdown.configure({
      markedOptions: {
        gfm: true,
        breaks: true,
        pedantic: false,
      },
    }),
  ],
  editable: true,
  content: props.content,
  contentType: 'markdown',
  autofocus: false,
  onCreate(props) {
    props.editor.commands.focus('all', { scrollIntoView: false });
  },
});

const focus = () => {
  editor.value?.commands.focus();
};
const getContent = () => {
  return editor.value?.getMarkdown() ?? '';
};

defineExpose({ focus, getContent });
</script>

<template>
  <div class="w-full h-full">
    <slot name="toolbar" :editor="editor" />
    <div class="px-4">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
@reference "../../../assets/style.css";

:deep(.is-editor-empty:first-child::before) {
  @apply text-surface-fg/80;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
