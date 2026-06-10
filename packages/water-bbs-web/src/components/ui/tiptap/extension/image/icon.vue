<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import { useFileDialog } from '@vueuse/core';
import { fileToBase64, getContext } from '@/utils';
import { EditorContextKey } from '../../editor.props';

const { onChange, open } = useFileDialog({
  accept: 'image/*',
  directory: false,
  multiple: false,
});

const ctx = getContext(EditorContextKey);

onChange((files) => {
  if (!files) {
    return;
  }
  const file = files.item(0);
  if (!file) {
    return;
  }
  fileToBase64(file)
    .then((base64) => {
      ctx.editor.commands.insertContent({
        type: 'image',
        attrs: {
          src: base64,
        },
      });
    });
});
</script>

<template>
  <ui-button
    icon
    size="sm"
    @click="() => open()"
  >
    <div
      class="size-4 text-warm-foreground i-material-symbols:add-photo-alternate"
    />
  </ui-button>
</template>
