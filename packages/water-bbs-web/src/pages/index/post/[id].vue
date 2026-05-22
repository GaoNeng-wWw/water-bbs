<script setup lang="ts">
import { postControllerCreateThread, postControllerGetPost } from '@/api';
import { ThreadList } from '@/components/app/thread';
import ThreadListSkeleton from '@/components/app/thread/thread-list.skeleton.vue';
import { UiTiptapEditor, UiButton } from '@/components/ui';
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
  let cnt = 0;
  while (cnt++ < 1000) {
    const task = postControllerCreateThread({
      path: { id: postId.toString() },
      body: {
        content: JSON.stringify(content),
      },
      client: NOT_PUBLIC_ENDPOINT,
    });
    tasks.push(task);
  }
  Promise.allSettled(tasks)
    .then(console.log);
};
</script>

<template>
  <div class="max-w-4xl w-full mx-auto pt-8 min-h-dvh">
    <suspense>
      <thread-list :post-id="state.postId" :title="state.title" />
      <template #fallback>
        <thread-list-skeleton />
      </template>
    </suspense>
    <div class="w-full min-h-32 bg-warm-100 p-2 space-y-2 rounded mt-4">
      <ui-tiptap-editor ref="editor" class="bg-warm-100" />
      <ui-button shape="solid" color="primary" @click="onClickReply">
        Reply
      </ui-button>
    </div>
  </div>
</template>
