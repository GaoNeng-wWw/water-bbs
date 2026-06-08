<script lang="ts" setup>
import { UiButton, UiPopover, UiPopoverContent, UiPopoverTrigger, UiForm, UiFormItem, UiInput } from '@/components/ui';
import { inject, reactive } from 'vue';
import { EditorContextKey } from '../../editor.props';

const model = reactive({
  title: '',
});
const ctx = inject(EditorContextKey)!;
const onClickCreate = () => {
  ctx.editor.commands.insertContent({
    type: 'collapse',
    attrs: {
      label: model.title,
    },
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '这是折叠面板内的可编辑内容' },
        ],
      },
    ],
  });
};
</script>

<template>
  <ui-popover>
    <ui-popover-trigger as-child>
      <ui-button
        icon
        size="sm"
      >
        <div class="size-4 text-warm-foreground i-material-symbols:collapse-all" />
      </ui-button>
    </ui-popover-trigger>
    <ui-popover-content :side-offset="12" align="start">
      <ui-form :model="model">
        <ui-form-item name="title" label="Title" required>
          <ui-input v-model="model.title" />
        </ui-form-item>
      </ui-form>
      <ui-button color="primary" shape="solid" full class="mt-2" @click="onClickCreate">
        Create
      </ui-button>
    </ui-popover-content>
  </ui-popover>
</template>
