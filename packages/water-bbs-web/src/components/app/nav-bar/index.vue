<script lang="ts" setup>
import {
  UiAvatar, UiPopover, UiPopoverContent, UiPopoverTrigger,
  UiListbox, UiListboxItem,
  type ListBoxItem,
} from '@/components/ui';
import { useRouter } from 'vue-router';

const router = useRouter();

const onSelect = (item: ListBoxItem) => {
  if (item.id === 'loggedout') {
    return;
  }
  router.push({ path: item.value });
};
</script>

<template>
  <div class="w-full h-fit py-2 sticky bg-background/20 backdrop-blur-md top-0">
    <div class="max-w-5xl mx-auto flex gap-3">
      <div class=" w-form-md h-form-md bg-danger-500 shrink-0" />
      <div class="grow" />
      <ui-popover>
        <ui-popover-trigger class="shrink-0 size-md" as="button">
          <ui-avatar fallback-text="test" />
        </ui-popover-trigger>
        <ui-popover-content width-follow-trigger>
          <ui-listbox mode="none" @select="onSelect">
            <ui-listbox-item id="Profile" value="/profile">
              Profile
            </ui-listbox-item>
            <ui-listbox-item id="loggedout" value="Logged Out" danger>
              Logged Out
            </ui-listbox-item>
          </ui-listbox>
        </ui-popover-content>
      </ui-popover>
    </div>
  </div>
</template>
