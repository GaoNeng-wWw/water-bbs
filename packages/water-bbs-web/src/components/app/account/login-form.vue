<script lang="ts" setup>
import { authControllerLogin } from '@/api';
import { UiForm, UiFormItem, UiInput, UiButton } from '@/components/ui';
import { useAccount } from '@/store';
import { reactive } from 'vue';
import z from 'zod';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const model = reactive({ email: '', password: '' });
const accountStore = useAccount();

const onClickLogin = () => {
  authControllerLogin({
    body: {
      ident_type: 'Email',
      ident_value: model.email,
      cert_value: model.password,
    },
  })
    .then(resp => resp.data)
    .then((data) => {
      if (!data) {
        return;
      }
      accountStore.setTokenPair(data.accessToken, data.refreshToken);
    })
    .catch(reason => console.log(reason));
};
</script>

<template>
  <ui-form :model="model" :schema="schema">
    <ui-form-item label="Email" name="email" required>
      <ui-input v-model="model.email" />
    </ui-form-item>
    <ui-form-item label="Password" name="password" required>
      <ui-input v-model="model.password" password />
    </ui-form-item>
    <ui-button color="primary" @click="onClickLogin">
      Login
    </ui-button>
  </ui-form>
</template>
