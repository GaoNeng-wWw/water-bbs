<script lang="ts" setup>
import { ref } from 'vue';
import loginForm from './login-form.vue';
import { UiDialog, UiDialogContent, UiTab, UiTabItem, UiAvatar } from '@/components/ui';
import RegisterForm from './register-form.vue';
import { useAccount, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { UiPopover, UiPopoverContent, UiPopoverTrigger, UiButton } from '@/components/ui';
import { authControllerLogout } from '@/api';
import { NOT_PUBLIC_ENDPOINT, useWallet } from '@/composables';
import { useRouter } from 'vue-router';

const { profile } = storeToRefs(useUserStore());
const { isLogged, accountId } = storeToRefs(useAccount());
const { setProfile } = useUserStore();
const { logout } = useAccount();
const { balance, getBalance } = useWallet();
const router = useRouter();
const active = ref('');
const status = ref(false);
const showProfilePanel = ref(false);
const onClick = () => {
  if (!isLogged.value) {
    status.value = true;
    return;
  }
  showProfilePanel.value = !showProfilePanel.value;
};
const onClickLogout = () => {
  authControllerLogout({
    client: NOT_PUBLIC_ENDPOINT,
  })
    .finally(() => {
      logout();
      setProfile(null);
      router.replace('/');
    });
};

getBalance();
</script>

<template>
  <div class="w-full h-fit">
    <ui-popover :open="showProfilePanel">
      <ui-popover-trigger as-child>
        <div
          class="
        w-full h-fit rounded-full min-w-0 flex items-center gap-4 hover:bg-warm-100 cursor-pointer transition duration-default
        border border-solid hover:border-warm-200 border-transparent
      "
          @click="onClick"
        >
          <ui-avatar v-if="profile" :avatar-url="profile?.avatar" :username="profile?.username" size="xs" />
          <div v-else class="size-8">
            <div class="size-full text-warm-foreground i-material-symbols:person" />
          </div>
        </div>
      </ui-popover-trigger>
      <ui-popover-content :side-offset="20" class="min-w-fit h-fit bg-warm-50 border border-solid border-warm-200 p-4 rounded" @pointer-down-outside="showProfilePanel = false">
        <div class="w-full h-fit flex flex-col gap-3 min-w-100px">
          <div class="w-full flex flex-col items-center py-2">
            <router-link :to="`/profile/${accountId}`">
              <p class="text-xl mb-1">
                {{ profile?.username }}
              </p>
            </router-link>
            <p class="text-xs text-warm-600">
              Balance: {{ balance }}
            </p>
          </div>
          <router-link :to="`/profile/${accountId}`">
            <ui-button full size="sm" class="justify-center!">
              Profile
            </ui-button>
          </router-link>
          <ui-button full size="sm" class="justify-center!" @click="onClickLogout">
            Logout
          </ui-button>
        </div>
      </ui-popover-content>
    </ui-popover>
    <!-- eslint-disable-next-line vue/no-v-model-argument -->
    <ui-dialog v-model:open="status">
      <ui-dialog-content>
        <ui-tab v-model="active">
          <ui-tab-item id="login" label="Login">
            <login-form />
          </ui-tab-item>
          <ui-tab-item id="register" label="Register">
            <register-form />
          </ui-tab-item>
        </ui-tab>
      </ui-dialog-content>
    </ui-dialog>
  </div>
</template>
