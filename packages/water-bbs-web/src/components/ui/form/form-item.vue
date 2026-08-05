<script lang="ts" setup>
import { useField } from 'vee-validate';
import { FormItemProvider } from './form-item.props';
import { computed } from 'vue';
import { useFormContext } from './form.props';

export type FormItemProps = {
  prop: string;
  label: string;
};

const { prop, label } = defineProps<FormItemProps>();

const { errorMessage, ...field } = useField(prop);

const form = useFormContext();

FormItemProvider({
  invalid: computed(() => !!errorMessage.value),
});
</script>

<template>
  <div
    class="w-full flex gap-2 data-[label-pos='top']:flex-col"
    :data-invalid="!!errorMessage || undefined"
    :data-label-pos="form.labelPosition.value"
  >
    <label for="" class="text-surface-fg">
      {{ label }} <span v-if="field.meta.required" class="text-danger-500">*</span>
    </label>
    <div class="flex flex-col grow">
      <slot :invalid="errorMessage" />
      <span v-if="errorMessage" class="text-danger text-sm">{{ errorMessage }}</span>
    </div>
  </div>
</template>
