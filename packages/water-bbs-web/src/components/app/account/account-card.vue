<script lang="ts" setup>
import { ref } from 'vue';
import loginForm from './login-form.vue';
import { UiDialog, UiDialogContent, UiTab, UiTabItem, UiAvatar } from '@/components/ui';
import RegisterForm from './register-form.vue';
import { useAccount, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { UiPopover, UiPopoverContent, UiPopoverTrigger, UiButton } from '@/components/ui';
import { authControllerLogout } from '@/api';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { useRouter } from 'vue-router';

const { profile } = storeToRefs(useUserStore());
const { isLogged, accountId } = storeToRefs(useAccount());
const { setProfile } = useUserStore();
const { logout } = useAccount();
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
</script>

<template>
  <div class="w-full h-fit">
    <ui-popover :open="showProfilePanel">
      <ui-popover-trigger as-child>
        <div
          class="
        w-full h-fit py-2 px-2 rounded-full min-w-0 flex items-center gap-4 hover:bg-warm-100 cursor-pointer transition duration-default
        border border-solid hover:border-warm-200 border-transparent
      "
          @click="onClick"
        >
          <ui-avatar v-if="profile" :avatar-url="profile?.avatar" :username="profile?.username" size="sm" />
          <div class="w-full text-warm-foreground min-w-0">
            <div v-if="!profile" class="w-full flex justify-center">
              <span>Login</span>
            </div>
            <span v-else>{{ profile.username }}</span>
          </div>
        </div>
      </ui-popover-trigger>
      <ui-popover-content class="w-[--reka-popper-anchor-width] h-fit bg-warm-100 border border-solid border-warm-200 my-2 p-2 rounded" @pointer-down-outside="showProfilePanel = false">
        <div class="w-full h-fit space-y-2">
          <router-link :to="`/profile/${accountId}`">
            <ui-button full size="sm" class="justify-start!">
              Profile
            </ui-button>
          </router-link>
          <ui-button full size="sm" class="justify-start!" @click="onClickLogout">
            Logout
          </ui-button>
        </div>
      </ui-popover-content>
    </ui-popover>
    <ui-dialog :open="status">
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
