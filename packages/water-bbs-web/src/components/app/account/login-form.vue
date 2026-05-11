<script lang="ts" setup>
import { UiForm, UiFormItem, UiInput, UiButton } from '@/components/ui';
import { reactive } from 'vue';
import z from 'zod';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const model = reactive({ email: '', password: '' });
</script>

<template>
  <ui-form :model="model" :schema="schema">
    <ui-form-item label="Email" name="email" required>
      <ui-input v-model="model.email" />
    </ui-form-item>
    <ui-form-item label="Password" name="password" required>
      <ui-input v-model="model.password" password />
    </ui-form-item>
    <ui-button color="primary">
      Login
    </ui-button>
  </ui-form>
</template>
