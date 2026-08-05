<script lang="ts" setup>
import { UiForm, UiFormItem, UiInput, UiButton } from '@/components/ui';
import { reactive } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';

const schema = z.object({
  email: z.email(),
  password: z.string(),
});

console.log(schema.required())

const model = reactive({ email: '', password: '' });
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
      <ui-button color="primary" size="full" html-type="button">
        登录
      </ui-button>
    </div>
  </ui-form>
</template>
