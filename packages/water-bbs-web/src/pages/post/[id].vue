<script setup lang="ts">
import { postControllerCreateThread, postControllerGetPost } from '@/api';
import { PostHeader } from '@/components/app/shell';
import { ThreadList } from '@/components/app/thread';
import ThreadListSkeleton from '@/components/app/thread/thread-list.skeleton.vue';
import { UiTiptapEditor, UiButton, Layout } from '@/components/ui';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { reactive, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const editor = useTemplateRef('editor');
const route = useRoute();
const router = useRouter();
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

const onClickReply = () => {
  if (!editor.value) {
    return;
  }
  const content = editor.value.getJson();
  const cnt = 0;
  postControllerCreateThread({
    path: { id: postId.toString() },
    body: {
      content: JSON.stringify(content),
    },
    client: NOT_PUBLIC_ENDPOINT,
  });
};
</script>

<template>
  <layout>
    <template #header>
      <div class="max-w-4xl w-full mx-auto">
        <post-header />
      </div>
    </template>
    <div class="max-w-4xl w-full mx-auto pt-8 h-full">
      <suspense>
        <thread-list :post-id="state.postId" :title="state.title" />
        <template #fallback>
          <thread-list-skeleton />
        </template>
      </suspense>
      <div class="w-full min-h-64 max-h-dvh flex flex-col overflow-hidden bg-warm-100 p-2 space-y-2 rounded mt-4 border border-warm-200/50">
        <ui-tiptap-editor ref="editor" :wysiwyg="false" class="min-h-32" />
        <div class="shrink-0 px-2">
          <ui-button shape="solid" color="primary" @click="onClickReply">
            Reply
          </ui-button>
        </div>
      </div>
    </div>
  </layout>
</template>
