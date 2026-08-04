<script lang="ts" setup>
import { UiForm, UiFormItem, UiInput } from '@/components/ui';
import { reactive } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';

const schema = z.object({
  email: z.email(),
})



const model = reactive({ email: '' });
</script>

<template>
  <ui-form :model="model" :schema="toTypedSchema(schema)">
    <ui-form-item label="Email" prop="email">
      <ui-input v-model="model.email" />
      <!-- <input v-model="model.email"> -->
    </ui-form-item>
  </ui-form>
</template>
