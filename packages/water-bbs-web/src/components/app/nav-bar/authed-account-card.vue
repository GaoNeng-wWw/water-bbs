<script lang="ts" setup>
import { getProfile } from '@/api';
import { client } from '@/api/client.gen';
import {
  UiAvatar,
  type ListBoxItem,

  UiPopover, UiPopoverTrigger, UiPopoverContent,
  UiListbox,
  UiListboxItem,
} from '@/components/ui';
import { useAuthStore, useProfile } from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfile();
if (profileStore.profile === null) {
  await getProfile({ client })
    .then(resp => resp.data)
    .then((data) => {
      if (!data) {
        authStore.clearToken();
        return;
      }
      return data;
    });
}

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
