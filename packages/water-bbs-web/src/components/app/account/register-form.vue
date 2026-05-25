<script lang="ts" setup>
import { accountControllerRegister } from '@/api';
import { UiForm, UiFormItem, UiInput, UiButton } from '@/components/ui';
import { reactive } from 'vue';
import z from 'zod';

const schema = z.object({
  email: z.string(),
  password: z.string(),
  captcha: z.string().optional(),
  inviteCode: z.string().optional(),
});

const model = reactive({ email: '', password: '', captcha: '', inviteCode: '', username: '' });

const onClickRegister = () => {
  accountControllerRegister({
    body: {
      username: model.username,
      ident_type: 'Email',
      ident_value: model.email,
      captcha: model.captcha,
      invite_code: model.inviteCode,
      password: model.password,
    },
  });
};
</script>

<template>
  <div class="w-full">
    <div class="h-fit">
      <ui-form :schema="schema" :inital-value="model">
        <ui-form-item label="Username" name="username" required>
          <ui-input v-model="model.username" />
        </ui-form-item>
        <ui-form-item label="Email" name="email" required>
          <ui-input v-model="model.email" />
        </ui-form-item>
        <ui-form-item label="Password" name="password" required>
          <ui-input v-model="model.password" password />
        </ui-form-item>
        <ui-form-item label="Captcha" name="captcha">
          <ui-input v-model="model.captcha" />
        </ui-form-item>
        <ui-form-item label="Invaite Code" name="inviteCode">
          <ui-input v-model="model.inviteCode" />
        </ui-form-item>
        <ui-button color="primary" html-type="button" @click="onClickRegister">
          Register
        </ui-button>
      </ui-form>
    </div>
  </div>
</template>
