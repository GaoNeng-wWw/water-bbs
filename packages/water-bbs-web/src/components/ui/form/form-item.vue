<script lang="ts" setup>
import { useField } from 'vee-validate';
import { FormItemProvider } from './form-item.props';
import { computed } from 'vue';

export type FormItemProps = {
  prop: string;
  label: string;
};

const { prop, label } = defineProps<FormItemProps>();

const { errorMessage } = useField(prop);

FormItemProvider({
  invalid: computed(() => !!errorMessage.value),
});
</script>

<template>
  <div
    class="w-full flex gap-2"
    :data-invalid="!!errorMessage || undefined"
  >
    <label for="" class="text-surface-fg">
      {{ label }}
    </label>
    <div class="flex flex-col grow">
      <slot :invalid="errorMessage" />
      <span v-if="errorMessage" class="text-danger text-sm">{{ errorMessage }}</span>
    </div>
  </div>
</template>
