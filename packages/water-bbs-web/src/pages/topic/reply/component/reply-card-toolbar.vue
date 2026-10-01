<script lang="ts" setup>
import { ProposalForm } from '@/components/app';
import {
  UiPopover,
  UiPopoverContent,
  UiPopoverTrigger,
  UiButton,
  UiListbox,
  UiListboxSection,
  UiListboxItem,
} from '@/components/ui';
import { useModal } from '@/composables';
import { h } from 'vue';

const props = defineProps<{
  replyId: string;
  hidden: boolean;
}>();

const emits = defineEmits<{
  commentClick: [];
}>();

const { Primitive, render, remove } = useModal();

const onClickComment = () => {
  emits('commentClick');
};
const onReport = () => {
  const id = render(
    h(
      ProposalForm,
      {
        defaultSteps: ['reply.hide'],
        allowAddStep: false,
        stepFieldConfig: { 'reply.hide': { defaults: { replyId: props.replyId }, disabled: ['replyId'] } },
        onDone: () => remove(id),
      },
    ),
  );
};
</script>

<template>
  <div class="w-full flex gap-2">
    <ui-button size="sm" variant="ghost" icon @click="onClickComment">
      <div class="icon-[boxicons--message-circle-reply-filled] size-4" />
    </ui-button>
    <ui-popover v-if="!hidden">
      <ui-popover-trigger>
        <ui-button icon variant="ghost" size="sm">
          <div class="icon-[material-symbols--more-horiz] size-4 text-surface-fg" />
        </ui-button>
      </ui-popover-trigger>
      <ui-popover-content class="w-50!">
        <ui-listbox mode="none">
          <ui-listbox-section label="行为">
            <primitive as-child>
              <ui-listbox-item id="report" value="report" danger @click="onReport">
                举报
              </ui-listbox-item>
            </primitive>
          </ui-listbox-section>
        </ui-listbox>
      </ui-popover-content>
    </ui-popover>
  </div>
</template>