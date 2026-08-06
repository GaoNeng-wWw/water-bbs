<script lang="ts" setup>
import {
  UiAvatar,
  type ListBoxItem,

  UiPopover, UiPopoverTrigger, UiPopoverContent,
  UiListbox,
  UiListboxItem,
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
  <ui-popover>
    <ui-popover-trigger class="shrink-0 size-md" as="button">
      <ui-avatar fallback-text="test" />
    </ui-popover-trigger>
    <ui-popover-content width-follow-trigger class="z-[calc(infinity+2)] bg-red-500 mt-4">
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
</template>
