<script setup lang="ts">
import { postControllerCreateThread, postControllerGetPost, postControllerUploadImage } from '@/api';
import { PostHeader } from '@/components/app/shell';
import { ThreadList } from '@/components/app/thread';
import ThreadListSkeleton from '@/components/app/thread/thread-list.skeleton.vue';
import { UiTiptapEditor, UiButton, Layout } from '@/components/ui';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { base64ToFile } from '@/utils';
import type { Editor } from '@tiptap/vue-3';
import { reactive, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';

const editor = useTemplateRef('editor');
const route = useRoute();
const postId = route.params.id;
const state = reactive({
  title: '',
  postId: route.params.id.toString(),
});

const { data } = await postControllerGetPost({ path: { id: postId.toString() }, client: NOT_PUBLIC_ENDPOINT });
if (data) {
  state.title = data.title;
}

const tasks: any[] = [];

const coverImage = (editor: Editor) => {
  const tr = editor.state.tr;
  editor.state.doc.descendants((node, pos) => {
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
  return Promise.all(tasks)
    .then((results) => {
      if (results.every(result => result)) {
        editor.view.dispatch(tr);
      }
      return true;
    });
};

const onClickReply = () => {
  if (!editor.value) {
    return;
  }
  const instance = editor.value.getInstance();

  coverImage(instance)
    .then(() => {
      return editor.value!.getMd();
    })
    .then((content) => {
      return postControllerCreateThread({
        path: { id: postId.toString() },
        body: {
          content,
        },
        client: NOT_PUBLIC_ENDPOINT,
      });
    });
};
</script>

<template>
  <layout>
    <template #header>
      <div class="max-w-4xl w-full mx-auto">
        <post-header :id="state.postId" />
      </div>
    </template>
    <div class="max-w-4xl w-full mx-auto pt-8 h-full">
      <suspense>
        <thread-list :post-id="state.postId" :title="state.title" />
        <template #fallback>
          <thread-list-skeleton />
        </template>
      </suspense>
      <div class="w-full min-h-64 max-h-dvh flex flex-col overflow-hidden bg-warm-50 p-2 space-y-2 rounded mt-4 border border-warm-200/50">
        <ui-tiptap-editor ref="editor" class="min-h-32" />
        <div class="shrink-0 px-2">
          <ui-button shape="solid" color="primary" @click="onClickReply">
            Reply
          </ui-button>
        </div>
      </div>
    </div>
  </layout>
</template>
