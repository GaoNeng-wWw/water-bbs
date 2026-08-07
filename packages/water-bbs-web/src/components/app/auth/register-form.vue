<script lang="ts" setup>
import { UiForm, UiFormItem, UiInput, UiButton } from '@/components/ui';
import { reactive } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';
import { register as regApi, login as loginApi } from '@/api';
import { client } from '@/api/client.gen';
import { useAuthStore } from '@/store';

const schema = z.object({
  email: z.email(),
  password: z.string(),
  nick: z.string(),
  bio: z.string(),
  confirmPassword: z.string(),
});

const model = reactive({
  email: '',
  password: '',
  nick: '',
  bio: '',
  confirmPassword: '',
});

const authStore = useAuthStore();

const register = async () => {
  if (model.password !== model.confirmPassword) {
    // TODO: toast 提示
  }
  await regApi({
    body: {
      identType: 'email', identValue: model.email,
      credentialType: 'password', credentialValue: model.password,
      profile: { bio: model.bio, nick: model.nick },
    },
  });
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
    <ui-form-item label="Nick" prop="nick">
      <ui-input v-model="model.nick" />
    </ui-form-item>
    <ui-form-item label="Bio" prop="bio">
      <ui-input v-model="model.bio" />
    </ui-form-item>
    <ui-form-item label="Password" prop="password">
      <ui-input v-model="model.password" password />
    </ui-form-item>
    <ui-form-item label="Confirm Password" prop="confirmPassword">
      <ui-input v-model="model.confirmPassword" password />
    </ui-form-item>
    <div class="mt-2 w-full">
      <ui-button color="primary" size="full" html-type="button" @click="register">
        登录
      </ui-button>
    </div>
  </ui-form>
</template>
