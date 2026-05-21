<script setup lang="ts">
import { ThreadList } from '@/components/app/thread';
import { UiTiptapEditor, UiButton } from '@/components/ui';
import { useTemplateRef } from 'vue';

const editor = useTemplateRef('editor');
const onClickReply = () => {
  if (!editor.value) {
    return;
  }
  const content = editor.value.getJson();
};

</script>

<template>
  <div class="max-w-4xl mx-auto pt-8 min-h-dvh">
    <thread-list />
    <div class="w-full min-h-32 bg-warm-100 p-2 space-y-2 rounded mt-4">
      <ui-tiptap-editor ref="editor" class="bg-warm-100" />
      <ui-button shape="solid" color="primary" @click="onClickReply">
        Reply
      </ui-button>
    </div>
  </div>
</template>
