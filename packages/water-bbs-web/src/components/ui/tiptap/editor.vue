<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import toolbar from './toolbar.vue';
import { provide, ref } from 'vue';
import { EditorContextKey, type EditorProps } from './editor.props.ts';
import { bold, italic, Collapse } from './extension';
import { Image } from './extension/image/ext.ts';

const {
  content,
  readonly,
  wysiwyg = false,
  extensions = [
    bold,
    italic,
    Collapse,
    Image,
  ],
  contentType = 'json',
} = defineProps<EditorProps>();

const editor = new Editor({
  content,
  contentType,
  editable: !readonly,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Markdown,
    ...extensions.filter(ext => ext.extension !== null).map(ext => ext.extension!),
  ],
  autofocus: true,
  editorProps: {
    attributes: {
      class: 'outline-none rounded h-full',
    },
  },
});

const getJson = () => editor.getJSON();
const getMd = () => editor.getMarkdown();
const getInstance = () => editor;
const source = ref(false);
const sourceCode = ref<string | null>(null);

defineExpose({ getJson, getMd, getInstance });
provide(EditorContextKey, {
  setSource: (val: boolean) => {
    source.value = val;
    if (val) {
      sourceCode.value = getMd();
      return;
    }
    if (sourceCode.value !== null && editor.markdown) {
      editor.commands.setContent(
        editor.markdown.parse(sourceCode.value),
      );
    }
  },
  extensions,
  editor,
});
</script>

<template>
  <div :data-readonly="readonly" class="w-full h-full flex flex-col rounded grow group data-[readonly=false]:p-2">
    <div v-if="!readonly" class="w-full h-fit shrink-0 min-h-0 border-b border-warm-200/50 pb-2">
      <toolbar
        :editor="editor"
      />
    </div>
    <editor-content
      v-if="!source"
      :editor="editor"
      class="
        max-w-full! prose prose-warm prose-p:first:mt-0 overflow-auto flex-1 group-data-[readonly=false]:px-2 mt-2
      "
    />
    <textarea
      v-else
      v-model="sourceCode"
      class="
        max-w-full! prose prose-warm prose-p:first:mt-0 px-2 mt-2 block field-sizing-content resize-y overflow-auto flex-1
        outline-none font-mono
      "
    />
  </div>
</template>
