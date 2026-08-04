<script lang="ts" setup>
import { UiField } from '../form';

defineOptions({
  inheritAttrs: true,
});

const modelValue = defineModel<string>();
</script>

<template>
  <ui-field v-bind="$attrs">
    <input v-model="modelValue" class="w-full h-full outline-none cursor-pointer">
  </ui-field>
</template>
