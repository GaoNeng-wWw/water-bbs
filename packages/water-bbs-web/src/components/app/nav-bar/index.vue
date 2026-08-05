<script lang="ts" setup>
import {
  UiAvatar, UiPopover, UiPopoverContent, UiPopoverTrigger,
  UiListbox, UiListboxItem,
  type ListBoxItem,
  UiDialog, UiDialogContent, UiDialogTrigger
} from '@/components/ui';
import { useRouter } from 'vue-router';
import LoginForm from '../auth/login-form.vue';
import AuthTab from '../auth/auth-tab.vue';

const router = useRouter();

const onSelect = (item: ListBoxItem) => {
  if (item.id === 'loggedout') {
    return;
  }
  router.push({ path: item.value });
};
</script>

<template>
  <div class="w-full h-fit py-2 px-6 sticky bg-background/20 backdrop-blur-md top-0 z-[calc(infinity+1)]">
    <div class="max-w-5xl mx-auto flex gap-3">
      <div class=" w-form-md h-form-md bg-danger-500 shrink-0" />
      <div class="grow" />
      <ui-dialog>
        <ui-dialog-trigger class="shrink-0" as-child>
          <ui-avatar fallback-text="test" class="shrink-0" />
        </ui-dialog-trigger>
        <ui-dialog-content>
          <auth-tab />
        </ui-dialog-content>
      </ui-dialog>
      <!-- <ui-popover>
        <ui-popover-trigger class="shrink-0 size-md" as="button">
          <ui-avatar fallback-text="test" />
        </ui-popover-trigger>
        <ui-popover-content width-follow-trigger class="z-[calc(infinity+2)] bg-red-500">
          <ui-listbox mode="none" @select="onSelect">
            <ui-listbox-item id="Profile" value="/profile">
              Profile
            </ui-listbox-item>
            <ui-listbox-item id="loggedout" value="Logged Out" danger>
              Logged Out
            </ui-listbox-item>
          </ui-listbox>
        </ui-popover-content>
      </ui-popover> -->
    </div>
  </div>
</template>
