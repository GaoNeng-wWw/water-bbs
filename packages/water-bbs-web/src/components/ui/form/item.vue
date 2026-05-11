<script setup lang="ts">
import { useField } from 'vee-validate';
import { toRef, provide, computed, inject, watch } from 'vue';
import { ITEM_CONTEXT_KEY } from './item.props';
import { FORM_CONTEXT_KEY } from './form.props';

const props = defineProps<{
  name: string;
  label?: string;
  required?: boolean;
}>();

const formContext = inject(FORM_CONTEXT_KEY);

const { errorMessage, setValue } = useField(
  toRef(props, 'name'),
  undefined,
  {
    validateOnValueUpdate: formContext?.validateMode.value === 'change',
  },
);

provide(
  ITEM_CONTEXT_KEY, {
    setValue,
    required: computed(() => props.required ?? false),
    name: computed(() => props.name),
  },
);
</script>

<template>
  <div
    :data-error="!!errorMessage" class="w-full group"
  >
    <label
      v-if="label"
      :data-required="required"
      class="text-base text-warm-foreground"
    >
      {{ label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    <div class="w-full mt-2">
      <slot />
      <transition name="fade">
        <p v-if="errorMessage" class="text-danger-500 font-bold text-sm">
          {{ errorMessage }}
        </p>
      </transition>
    </div>
  </div>
</template>
