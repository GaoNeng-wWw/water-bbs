<script lang="ts" setup>
import { computed } from 'vue';
import { UiField } from '../form';

defineOptions({
  inheritAttrs: true,
});

const { password, textType = 'text', disabled = false } = defineProps<{
  /** @deprecated */
  password?: boolean;
  textType?: 'text' | 'password';
  disabled?: boolean;
}>();

const modelValue = defineModel<string>();

const type = computed(() => password ? 'password' : textType);
</script>

<template>
  <ui-field v-bind="{ ...$attrs, disabled }">
    <input v-model="modelValue" class="w-full h-full outline-none cursor-pointer" :type="type" :disabled="disabled">
  </ui-field>
</template>
