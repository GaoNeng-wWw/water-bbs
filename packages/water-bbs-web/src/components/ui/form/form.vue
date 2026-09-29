<script lang="ts" setup generic="Schema extends Record<string, any>">
import { useForm } from 'vee-validate';
import { FormProvider, type FormProps } from './form.props';
import { computed, watch } from 'vue';

const {
  schema,
  model = {},
  labelPosition: formPosition,
  triggerMethod: formTriggerMethod,
} = defineProps<FormProps<Schema>>();

const emit = defineEmits<{
  submit: [values: Record<string, any>];
  invalid: [errors: Partial<Record<string, string>>];
}>();

const { setValues, handleSubmit, validate } = useForm({
  initialValues: model,
  validationSchema: schema,
});

FormProvider({
  labelPosition: computed(() => formPosition ?? 'left'),
  triggerMethod: computed(() => formTriggerMethod ?? 'change'),
});

watch(() => model, () => {
  setValues(model, true);
}, { deep: true });

const onSubmit = handleSubmit(
  values => emit('submit', values),
  ({ errors }) => emit('invalid', errors),
);

defineExpose({ validate, handleSubmit });
</script>

<template>
  <form v-bind="$attrs" class="form" @submit.prevent="onSubmit">
    <slot />
  </form>
</template>

<style scoped>
.form {
  display: grid;
  grid-template-columns: repeat(1, max-content minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 16px;
}
</style>
