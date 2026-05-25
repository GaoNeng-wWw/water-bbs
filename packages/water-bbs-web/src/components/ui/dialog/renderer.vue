<script lang="ts" setup>
import { useDialog } from '@/composables';
import { DialogRoot } from 'reka-ui';
import UiDialogContent from './content.vue';

const { dialogs, closeDialog, onDialogExit } = useDialog();

function onOpenChange(id: number, value: boolean) {
  if (value) {
    return;
  }
  closeDialog(id);
}
</script>

<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-for-template-key -->
    <template v-for="dialog of dialogs" :key="dialog.id">
      <!-- eslint-disable-next-line vue/no-v-model-argument -->
      <dialog-root v-model:open="dialog.show as unknown as boolean" :modal="true" @update:open="onOpenChange(dialog.id, $event)">
        <ui-dialog-content @finish="() => onDialogExit(dialog.id)">
          <component :is="dialog.component" @close="(data: any) => closeDialog(dialog.id, data)" />
        </ui-dialog-content>
      </dialog-root>
    </template>
  </div>
</template>
