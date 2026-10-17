<script lang="ts" setup>
import {
  UiButton,
  UiDrawerRoot,
  UiDrawerTrigger,
  UiDrawerContent,
} from '@/components/ui';
import { GovernanceMemberKind } from '@/directive';
import { onBeforeUnmount, shallowRef, useTemplateRef, watchEffect } from 'vue';
import v1 from './task-schema-v1.json';
import * as monaco from 'monaco-editor';
import { configureMonacoYaml } from 'monaco-yaml-inline';

const editorContainer = useTemplateRef('editor-container');
const editorInstance = shallowRef();
configureMonacoYaml(monaco, {
  schemas: [{
    fileMatch: ['**/task.yaml'],
    uri: 'inmemory://task',
    schema: v1,
  }],
});

const uri = monaco.Uri.parse('file:///task.yaml');
const model = monaco.editor.createModel('', 'yaml', uri);

watchEffect(() => {
  if (!editorContainer.value) {
    return;
  }

  editorInstance.value = monaco.editor.create(editorContainer.value, {
    model,
    theme: 'vs-dark',
    automaticLayout: true,
  });
});

onBeforeUnmount(() => {
  editorInstance.value?.dispose();
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
        <div ref="editor-container" class="h-full" />
      </ui-drawer-content>
    </ui-drawer-root>
  </div>
</template>
