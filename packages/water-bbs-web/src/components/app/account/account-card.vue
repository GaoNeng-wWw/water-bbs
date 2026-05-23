<script lang="ts" setup>
import { ref } from 'vue';
import loginForm from './login-form.vue';
import { UiDialog, UiDialogContent, UiTab, UiTabItem } from '@/components/ui';
import RegisterForm from './register-form.vue';
import { useAccount, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { UiPopover, UiPopoverContent, UiPopoverTrigger, UiButton } from '@/components/ui';

const { profile } = storeToRefs(useUserStore());
const { isLogged } = storeToRefs(useAccount());
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
          <div class="size-10 rounded-full bg-red-500 shrink-0" />
          <div class="text-warm-foreground min-w-0">
            <span v-if="!profile">未登录</span>
            <span v-else>{{ profile.username }}</span>
          </div>
        </div>
      </ui-popover-trigger>
      <ui-popover-content class="w-[--reka-popper-anchor-width] h-fit bg-warm-100 border border-solid border-warm-200 my-2 p-2 rounded" @pointer-down-outside="showProfilePanel = false">
        <div class="w-full h-fit space-y-2">
          <router-link to="/profile/123">
            <ui-button full size="sm" class="justify-start!">
              个人中心
            </ui-button>
          </router-link>
          <ui-button full size="sm" class="justify-start!">
            退出登录
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
