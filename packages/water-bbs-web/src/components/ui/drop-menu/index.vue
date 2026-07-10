<script lang="ts" setup>
import { BaseDrop } from '../base-drop';
</script>

<template>
  <base-drop align="center">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #content>
      <slot />
    </template>
  </base-drop>
</template>
