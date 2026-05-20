<script setup lang="ts">
import { CategoryList } from '@/components/app';
import AccountCard from '../account/account-card.vue';
import { TreeSelect, UiButton, UiInput } from '@/components/ui';
import { UiDrawer, UiDrawerContent, UiTiptapEditor } from '@/components/ui';
import { DrawerHandle } from 'vaul-vue';
import { useToggle } from '@vueuse/core';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import { useApi, useNestedCategoryTreeData } from '@/composables';
import type { FlattenNode } from '@/components/ui/tree/tree.prop';
import { postControllerCreatePost } from '@/api';

const [postEditDrawerVisiblity, setVisbility] = useToggle();
const activeSnapPoint = ref('200px');

const { tree, expand } = useNestedCategoryTreeData();

expand();

const activeNodes = ref<FlattenNode[]>([]);
const postTitle = ref('');
const editor = useTemplateRef('editor');
const onClickSend = () => {
  if (!editor.value) {
    // TODO: toast
    return;
  }
  postControllerCreatePost({
    client: useApi(),
    body: {
      categoryId: activeNodes.value[0].id,
      content: JSON.stringify(editor.value?.getJson()),
      title: postTitle.value,
    },
  })
    .then(() => {
      setVisbility(false);
    });
};
</script>

<template>
  <div class="w-full h-full py-4 overflow-auto flex flex-col px-4 space-y-8">
    <div class="w-full h-fit">
      <ui-button full color="primary" shape="solid" rounded="lg" @click="() => setVisbility(true)">
        Publish
      </ui-button>
    </div>
    <div class="w-full h-full grow overflow-auto">
      <category-list />
    </div>
    <div class="w-full h-fit">
      <account-card />
    </div>
    <ui-drawer
      v-model:active-snap-point="activeSnapPoint"
      v-model="postEditDrawerVisiblity" :snap-points="['200px', '355px', 0.95]"
    >
      <ui-drawer-content class="fixed bottom-0 left-0 right-0 h-full  flex justify-center">
        <div class="w-4xl flex flex-col bg-warm-50 p-4 min-h-64 max-h-95dvh overflow-hidden border border-solid border-warm-200 rounded-t-lg">
          <drawer-handle class="cursor-pointer shrink-0" />
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
                  <tree-select v-model="activeNodes" :data="tree" @expand="(node) => expand(node.id)" />
                </div>
              </div>
              <div class="w-full h-full min-h-0 shrink grow overflow-unset">
                <ui-tiptap-editor ref="editor" class="overflow-auto" />
              </div>
            </div>
          </div>
        </div>
      </ui-drawer-content>
    </ui-drawer>
  </div>
</template>
