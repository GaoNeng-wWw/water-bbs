<script lang="ts" setup generic="Schema extends Record<string, any>">
import { useForm } from 'vee-validate';
import { FormProvider, type FormProps } from './form.props';
import { computed, watch } from 'vue';

const {
  schema,
  model = {},
  labelPosition: formPosition,
} = defineProps<FormProps<Schema>>();

const { setValues } = useForm({
  initialValues: model,
  validationSchema: schema,
});

FormProvider({
  labelPosition: computed(() => formPosition ?? 'left'),
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
