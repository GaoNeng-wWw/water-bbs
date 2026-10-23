<script lang="ts" setup>
import {
  UiButton,
  UiDrawerRoot,
  UiDrawerTrigger,
  UiDrawerContent,
} from '@/components/ui';
import { GovernanceMemberKind } from '@/directive';
import { onBeforeUnmount, shallowRef, useTemplateRef, watchEffect } from 'vue';
import * as monaco from 'monaco-editor';
import { configureMonacoYaml } from 'monaco-yaml-inline';
import { createTask, getTaskSchema } from '@/api';
import { load } from 'js-yaml';

const resp = await getTaskSchema();
const schema = resp.data;

const editorContainer = useTemplateRef('editor-container');
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null);
configureMonacoYaml(monaco, {
  schemas: [{
    fileMatch: ['**/task.yaml'],
    uri: 'inmemory://task',
    schema,
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

const onSubmitTask = () => {
  const yamlStr = editorInstance.value?.getModel()?.getValue();
  if (!yamlStr) {
    return;
  }
  createTask({
    body: {
      schema: load(yamlStr) as any,
    },
  });
};
</script>

<template>
  <div v-governance-member="GovernanceMemberKind.Bd" class="w-full h-fit flex justify-between items-center">
    <div class="w-fit h-full flex items-center">
      <router-link to="/">
        <ui-button variant="ghost" icon size="sm">
          <div class="size-4 icon-[material-symbols--chevron-backward]" />
        </ui-button>
      </router-link>
    </div>
    <ui-drawer-root direction="right">
      <ui-drawer-trigger>
        <ui-button variant="solid" color="primary">
          Create Task
        </ui-button>
      </ui-drawer-trigger>
      <ui-drawer-content hidden-handle>
        <div class="w-full h-full flex flex-col">
          <p class="text-surface-fg text-3xl mb-3">
            Task Editor
          </p>
          <div class="grow shrink flex flex-col gap-2">
            <div ref="editor-container" class="grow shrink" />
            <div class="w-full shrink-0 grow">
              <ui-button @click="onSubmitTask">
                Submit
              </ui-button>
            </div>
          </div>
        </div>
      </ui-drawer-content>
    </ui-drawer-root>
  </div>
</template>
