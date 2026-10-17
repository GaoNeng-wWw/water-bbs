<script lang="ts" setup>
import {
  UiButton,
  UiDrawerRoot,
  UiDrawerTrigger,
  UiDrawerContent,
} from '@/components/ui';
import { GovernanceMemberKind } from '@/directive';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useTemplateRef, watchEffect } from 'vue';
import { yaml } from '@codemirror/lang-yaml';
import { indentWithTab } from '@codemirror/commands';
import { autocompletion } from '@codemirror/autocomplete';
import { yamlSchema } from '@langchain/codemirror-json-schema/yaml';
import {oneDark} from '@codemirror/theme-one-dark';
import v1 from './task-schema-v1.json';

const editorContainer = useTemplateRef('editor-container');

const state = EditorState.create({
  extensions: [
    basicSetup,
    oneDark,
    yaml(),
    autocompletion(),
    yamlSchema(v1),
    keymap.of([indentWithTab]),
  ]
});

const editor = new EditorView({
  state,
});
watchEffect(() => {
  if (editorContainer.value) {
    editorContainer.value.appendChild(editor.dom);
  }
});

const onClickCreateTask = () => {

};
</script>

<template>
  <div v-governance-member="GovernanceMemberKind.Bd" class="w-full flex justify-between">
    <div />
    <ui-drawer-root direction="right">
      <ui-drawer-trigger>
        <ui-button variant="solid" color="primary" @click="onClickCreateTask">
          Create Task
        </ui-button>
      </ui-drawer-trigger>
      <ui-drawer-content hidden-handle>
        <div ref="editor-container" />
      </ui-drawer-content>
    </ui-drawer-root>
  </div>
</template>
