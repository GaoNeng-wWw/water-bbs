<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';

const { loading = false, cancel = true } = defineProps<{
  loading?: boolean;
  cancel?: boolean;
}>();

const emits = defineEmits<{
  action: ['submit' | 'cancel'];
  cancel: [];
  submit: [string];
}>();

const editor = useEditor({
  editable: true,
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
  contentType: 'markdown',
  editorProps: {
    attributes: {
      class: 'prose prose-p:max-w-full dark:prose-invert w-full! max-w-full min-h-32 border border-surface-200 p-4 rounded-lg outline-none max-h-10 overflow-auto',
    },
  },
});

const onClickSubmit = () => {
  emits('submit', editor.value?.getMarkdown() ?? '');
  emits('action', 'submit');
};
const onClickCancel = () => {
  emits('cancel');
  emits('action', 'cancel');
};
</script>

<template>
  <div class="w-full">
    <editor-content :editor="editor" class="w-full" />
    <div class="w-fit flex gap-2 mt-2 mr-0 ml-auto">
      <ui-button size="sm" color="primary" :loading="loading" @click="onClickSubmit">
        Submit
      </ui-button>
      <ui-button v-if="cancel" size="sm" color="danger" @click="onClickCancel">
        Cancel
      </ui-button>
    </div>
  </div>
</template>
