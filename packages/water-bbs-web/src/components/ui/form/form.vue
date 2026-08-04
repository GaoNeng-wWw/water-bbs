<script lang="ts" setup generic="Schema extends Record<string, any>">
import { useForm } from 'vee-validate';
import type { FormProps } from './form.props';
import { watch } from 'vue';

const {
  schema,
  model = {},
} = defineProps<FormProps<Schema>>();

const { validate, setValues, errors } = useForm({
  initialValues: model,
  validationSchema: schema,
});

watch(() => model, () => {
  setValues(model, true);
}, { deep: true });
</script>

<template>
  <form v-bind="$attrs">
    <slot />
  </form>
</template>
