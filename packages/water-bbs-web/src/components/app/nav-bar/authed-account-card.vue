<script lang="ts" setup>
import { getProfile, logout } from '@/api';
import { client } from '@/api/client.gen';
import {
  UiAvatar,
  type ListBoxItem,
  UiPopover, UiPopoverTrigger, UiPopoverContent,
  UiListbox,
  UiListboxItem, UiDialog, UiDialogContent, UiDialogTrigger,
} from '@/components/ui';
import { useAuthStore, useProfile } from '@/store';
import { useRouter } from 'vue-router';
import { TransactionsListSkeleton, TransactionsList } from '../wallet';
import BalanceSkeleton from '../wallet/balance.skeleton.vue';
import Balance from '../wallet/balance.vue';

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfile();
if (profileStore.profile === null) {
  await getProfile({ client })
    .then(resp => resp.data)
    .then((data) => {
      if (!data) {
        // authStore.clearToken();
        return;
      }
      profileStore.setProfile(data);
      return data;
    });
}

const onSelect = (item: ListBoxItem) => {
  if (item.id === 'logout') {
    logout()
      .then(() => {
        authStore.clearToken();
        profileStore.clearProfile();
      });
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
      <ui-avatar
        :fallback-text="profileStore.profile?.nick ?? profileStore.profile?.id.toString() ?? ''"
        :url="`/__avatar__/${profileStore.profile?.id.toString()}`"
      />
    </ui-popover-trigger>
    <ui-popover-content width-follow-trigger class="bg-red-500 mt-4">
      <ui-listbox mode="none" @select="onSelect">
        <ui-dialog>
          <ui-dialog-trigger>
            <ui-listbox-item id="wallet" value="wallet">
              {{ t('wallet') }}
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
        <ui-listbox-item id="tasks" value="/tasks">
          {{ t('tasks') }}
        </ui-listbox-item>
        <ui-listbox-item id="Profile" value="/profile">
          {{ t('profile') }}
        </ui-listbox-item>
        <ui-listbox-item id="logout" value="logout" danger>
          {{ t('logout') }}
        </ui-listbox-item>
      </ui-listbox>
    </ui-popover-content>
  </ui-popover>
</template>

<i18n lang="yaml">
zh-cn:
  wallet: 钱包
  tasks: 任务
  profile: 个人中心
  logout: 退出登录
en-us:
  wallet: Wallet
  tasks: Tasks
  profile: Profile
  logout: Log out
</i18n>
