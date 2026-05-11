<script setup lang="ts" generic="T extends GenericObject">
import { useForm, type GenericObject } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { z } from 'zod';
import { computed, provide, watch } from 'vue';
import { FORM_CONTEXT_KEY } from './form.props';

const { schema, model = {}, triggerMode = 'change' } = defineProps<{
  schema?: z.ZodType<T>;
  model?: T;
  triggerMode?: 'change' | 'blur' | 'custom';
}>();

const emit = defineEmits<{
  (e: 'submit', values: T): void;
}>();

const { handleSubmit, isSubmitting, resetForm, values, setValues } = useForm({
  validationSchema: schema ? toTypedSchema(schema) : {},
  initialValues: computed(() => model),
});

const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});

defineExpose({ resetForm, values });
provide(FORM_CONTEXT_KEY, {
  validateMode: computed(() => triggerMode),
});

watch(() => model, () => {
  setValues(model);
}, { deep: true, immediate: true });
</script>

<template>
  <form novalidate class="w-full flex flex-col gap-4" @submit.prevent="onSubmit">
    <slot
      :is-submitting="isSubmitting"
      :reset-form="resetForm"
    />
  </form>
</template>
