<script lang="ts" setup>
import {
  UiPopover,
  UiPopoverContent,
  UiPopoverTrigger,
  UiButton,
  UiListbox,
  UiListboxSection,
  UiListboxItem,
} from '@/components/ui';

const emits = defineEmits<{
  commentClick: [];
}>();

const onClickComment = () => {
  emits('commentClick');
};
</script>

<template>
  <div class="w-full flex gap-2">
    <ui-button size="sm" variant="ghost" icon @click="onClickComment">
      <div class="icon-[boxicons--message-circle-reply-filled] size-4" />
    </ui-button>
    <ui-popover>
      <ui-popover-trigger>
        <ui-button icon variant="ghost" size="sm">
          <div class="icon-[material-symbols--more-horiz] size-4 text-surface-fg" />
        </ui-button>
      </ui-popover-trigger>
      <ui-popover-content class="w-50!">
        <ui-listbox mode="none">
          <ui-listbox-section label="行为">
            <ui-listbox-item id="report" value="report" danger>
              举报
            </ui-listbox-item>
          </ui-listbox-section>
        </ui-listbox>
      </ui-popover-content>
    </ui-popover>
  </div>
</template>
