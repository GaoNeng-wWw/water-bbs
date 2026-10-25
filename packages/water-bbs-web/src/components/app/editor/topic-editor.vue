<script lang="ts" setup>
import { UiShadowScroll } from '@/components/ui';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Img } from './extension/node/image.node';

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
    Img,
  ],
  editable: true,
});

const getContent = () => editor.value?.getJSON() ?? {};
const getEditor = () => editor.value;

defineExpose({ getContent, getEditor });
</script>

<template>
  <div class="w-full h-fit rounded-m border border-surface-200 relative">
    <div class="w-full h-fit sticky top-0">
      <slot name="toolbar" :editor="editor" />
    </div>
    <ui-shadow-scroll class="w-full h-50">
      <div class="w-full p-4">
        <editor-content :editor="editor" />
      </div>
    </ui-shadow-scroll>
  </div>
</template>
