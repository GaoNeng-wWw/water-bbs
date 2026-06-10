<script setup lang="ts">
import { TreeSelect, UiButton, UiInput } from '@/components/ui';
import { UiTiptapEditor } from '@/components/ui';
import { ref, useTemplateRef } from 'vue';
import { NOT_PUBLIC_ENDPOINT, useNestedCategoryTreeData } from '@/composables';
import type { FlattenNode } from '@/components/ui/tree/tree.prop';
import { postControllerCreatePost, postControllerUploadImage } from '@/api';
import { base64ToFile } from '@/utils';

const emits = defineEmits<{
  close: [];
}>();
const { tree, expand } = useNestedCategoryTreeData();
expand();

const activeNodes = ref<FlattenNode[]>([]);
const postTitle = ref('');
const editor = useTemplateRef('editor');
const onClickSend = () => {
  const instance = editor.value?.getInstance();
  if (!instance) {
    return;
  }
  const tr = instance.state.tr;
  const tasks: Promise<boolean>[] = [];
  instance.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image') {
      const task = base64ToFile(node.attrs.src)
        .then((file) => {
          return postControllerUploadImage({
            client: NOT_PUBLIC_ENDPOINT,
            body: { file },
          });
        })
        .then(resp => resp.data)
        .then(data => data ? data.url : '')
        .then(url => tr.setNodeAttribute(pos, 'src', url))
        .then(() => true)
        .catch(() => false);
      tasks.push(task);
    }
  });
  Promise.all(tasks)
    .then((results) => {
      if (results.every(result => result)) {
        instance.view.dispatch(tr);
      }
      return editor.value?.getMd() || '';
    })
    .then((md) => {
      return postControllerCreatePost({
        client: NOT_PUBLIC_ENDPOINT,
        body: {
          categoryId: activeNodes.value[0].id,
          content: md,
          title: postTitle.value,
        },
      });
    })
    .then(() => {
      emits('close');
    });
};
</script>

<template>
  <div class="w-full flex flex-col min-h-64 overflow-auto h-full ">
    <div class="w-full h-fit flex flex-col grow shrink overflow-hidden">
      <div class="w-fit h-fit shrink-0 grow-0 mr-0 ml-auto">
        <ui-button color="primary" shape="solid" @click="onClickSend">
          Send
        </ui-button>
      </div>
      <div class="mt-2 flex flex-col grow shrink min-h-0 overflow-auto space-y-2 flex flex-col ">
        <div class="flex w-full gap-4 flex-wrap">
          <div class="shrink-0 grow w-1/2 min-w-200px">
            <p class="text-warm-foreground mb-2">
              Title
            </p>
            <ui-input v-model="postTitle" />
          </div>
          <div class="text-warm-foreground min-w-sm">
            <p class="mb-2">
              分区
            </p>
            <tree-select class="z-9999" v-model="activeNodes" :data="tree" @expand="(node) => expand(node.id)" />
          </div>
        </div>
        <div class="w-full h-full min-h-0 shrink grow overflow-unset">
          <ui-tiptap-editor ref="editor" class="overflow-auto" />
        </div>
      </div>
    </div>
  </div>
</template>
