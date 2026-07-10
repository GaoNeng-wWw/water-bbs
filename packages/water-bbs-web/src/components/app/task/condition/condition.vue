<script lang="ts" setup>
import Tree from './tree/tree.vue';

const modelValue = defineModel<Record<string, any>>();
</script>

<template>
  <tree v-model="modelValue" />
</template>
