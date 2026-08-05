<script lang="ts" setup>
import { UiTabs, UiTabItem } from '@/components/ui';
import LoginForm from './login-form.vue';
import RegisterForm from './register-form.vue';
</script>

<template>
  <ui-tabs>
    <ui-tab-item id="login" label="登录">
      <login-form />
    </ui-tab-item>
    <ui-tab-item id="register" label="注册">
      <register-form />
    </ui-tab-item>
  </ui-tabs>
</template>
