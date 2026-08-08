<script lang="ts" setup>
import { login as loginApi } from '@/api/sdk.gen';
import { client } from '@/api/client.gen';
import { UiForm, UiFormItem, UiInput, UiButton } from '@/components/ui';
import { reactive } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';
import { useAuthStore } from '@/store';

const schema = z.object({
  email: z.email(),
  password: z.string(),
});

const authStore = useAuthStore();
const model = reactive({ email: '', password: '' });

const login = () => {
  loginApi({
    body: {
      credentialType: 'password',
      identType: 'email',
      credentialValue: model.password,
      identValue: model.email,
    },
    client,
  })
    .then(resp => resp.data)
    .then((tokenPair) => {
      if (!tokenPair) {
        return;
      }
      authStore.setAccessToken(tokenPair.accessToken);
      authStore.setRefreshToken(tokenPair.refreshToken);
      client.setConfig({
        ...client.getConfig(),
        headers: {
          Authorization: `bearer ${tokenPair.accessToken}`,
        },
      });
    });
};
</script>

<template>
  <ui-form :model="model" :schema="toTypedSchema(schema)" label-position="top">
    <ui-form-item label="Email" prop="email">
      <ui-input v-model="model.email" />
    </ui-form-item>
    <ui-form-item label="Password" prop="password">
      <ui-input v-model="model.password" password />
    </ui-form-item>
    <div class="mt-2 w-full">
      <ui-button
        color="primary"
        size="full"
        html-type="button"
        @click="login"
      >
        登录
      </ui-button>
    </div>
  </ui-form>
</template>
