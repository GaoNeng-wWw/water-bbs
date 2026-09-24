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
  <form v-bind="$attrs" class="form">
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