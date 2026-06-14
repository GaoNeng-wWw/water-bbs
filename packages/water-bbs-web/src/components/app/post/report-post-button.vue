<script lang="ts" setup>
import { postControllerHidePost } from '@/api';
import { UiButton, UiDialog, UiDialogTrigger, UiDialogContent, UiForm, UiFormItem, UiInput, UiTiptapEditor } from '@/components/ui';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { useToggle } from '@vueuse/core';
import { reactive } from 'vue';

const props = defineProps<{ id: string }>();

const emits = defineEmits<{
  report: [typeof data];
}>();

const data = reactive({
  reason: '',
});

const [dialogVisible, setDialogVisible] = useToggle(false);

const report = () => {
  postControllerHidePost({
    body: {
      reason: data.reason,
    },
    client: NOT_PUBLIC_ENDPOINT,
    path: {
      id: props.id,
    },
  })
    .then(console.log)
    .catch(console.error)
    .finally(() => {
      setDialogVisible(false);
    });
};
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <ui-dialog v-model:open="dialogVisible" class="overflow-auto">
    <ui-dialog-trigger>
      <ui-button size="sm" icon>
        <div class="i-material-symbols:report size-4" />
      </ui-button>
    </ui-dialog-trigger>
    <ui-dialog-content>
      <div class="w-full h-full flex flex-col overflow-auto">
        <div class="w-full h-full overflow-auto">
          <ui-form>
            <ui-form-item label="Reason" name="reason">
              <ui-tiptap-editor :toolbar="false" :style="false" class="px-0! *:px-0" />
            </ui-form-item>
          </ui-form>
        </div>
        <div class="w-full h-fit grow-0 shrink-0">
          <ui-button @click="report">
            Report
          </ui-button>
        </div>
      </div>
    </ui-dialog-content>
  </ui-dialog>
</template>
