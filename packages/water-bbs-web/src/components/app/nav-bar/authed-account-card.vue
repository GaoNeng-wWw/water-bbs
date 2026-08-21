<script lang="ts" setup>
import { getBalance, getProfile } from '@/api';
import { client } from '@/api/client.gen';
import {
  UiAvatar,
  type ListBoxItem,
  UiPopover, UiPopoverTrigger, UiPopoverContent,
  UiListbox,
  UiListboxItem, UiDialog, UiDialogContent, UiDialogTrigger,
} from '@/components/ui';
import { useAuthStore, useProfile } from '@/store';
import { useQuery } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { TransactionsListSkeleton, TransactionsList } from '../wallet';
import BalanceSkeleton from '../wallet/balance.skeleton.vue';
import Balance from '../wallet/balance.vue';

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
      profileStore.setProfile(data);
      return data;
    });
}

const onSelect = (item: ListBoxItem) => {
  if (item.id === 'loggedout') {
    return;
  }
  if (item.id === 'wallet') {
    return;
  }
  router.push({ path: item.value });
};
</script>

<template>
  <ui-popover>
    <ui-popover-trigger class="shrink-0 size-md" as="button">
      <ui-avatar :fallback-text="profileStore.profile?.nick ?? profileStore.profile?.id.toString() ?? ''" />
    </ui-popover-trigger>
    <ui-popover-content width-follow-trigger class="z-[calc(infinity+2)] bg-red-500 mt-4">
      <ui-listbox mode="none" @select="onSelect">
        <ui-dialog>
          <ui-dialog-trigger>
            <ui-listbox-item id="wallet" value="wallet">
              钱包
            </ui-listbox-item>
          </ui-dialog-trigger>
          <ui-dialog-content class="bg-surface-100! space-y-2">
            <suspense>
              <balance />
              <template #fallback>
                <balance-skeleton />
              </template>
            </suspense>
            <suspense>
              <transactions-list />
              <template #fallback>
                <transactions-list-skeleton />
              </template>
            </suspense>
          </ui-dialog-content>
        </ui-dialog>
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
