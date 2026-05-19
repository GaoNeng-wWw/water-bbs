<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import toolbar from './toolbar.vue';

const editor = new Editor({
  content: '',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
  ],
  autofocus: true,
  editorProps: {
    attributes: {
      class: 'outline-none rounded bg-warm-50 h-full',
    },
  },
});

const getJson = () => editor.getJSON();
defineExpose({ getJson });
</script>

<template>
  <div class="w-full flex flex-col bg-warm-50 p-2">
    <toolbar :editor="editor" />
    <editor-content
      :editor="editor"
      class="max-w-full! prose prose-warm prose-p:first:mt-0 flex-1 px-2"
    />
  </div>
</template>
