<script lang="ts" setup>
import { ref } from 'vue';
import loginForm from './login-form.vue';
import { UiDialog, UiDialogContent, UiTab, UiTabItem } from '@/components/ui';
import { LayoutGroup } from 'motion-v';
import RegisterForm from './register-form.vue';

const active = ref('');
const status = ref(false);
const onClick = () => {
  status.value = true;
};
</script>

<template>
  <div class="w-full h-fit">
    <div
      class="
        w-full h-fit py-2 px-2 rounded-full min-w-0 flex items-center gap-4 hover:bg-warm-100 cursor-pointer transition duration-default
        border border-solid hover:border-warm-200 border-transparent
      "
      @click="onClick"
    >
      <div class="size-10 rounded-full bg-red-500" />
      <span class="text-warm-foreground">未登录</span>
    </div>
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
