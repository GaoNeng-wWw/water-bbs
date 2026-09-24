<script lang="ts" setup>
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import { computed } from 'vue';
import { checkbox } from './style';
import { Icon } from '@iconify/vue';

const { size = 'md' } = defineProps<{
  size?: 'sm' | 'md' | 'lg';
}>();

const modelValue = defineModel<boolean>({ required: false, default: () => false });

const style = computed(() => checkbox({ size }));
</script>

<template>
  <checkbox-root v-model="modelValue" :class="style.base()">
    <checkbox-indicator :class="style.indicator()">
      <icon icon="radix-icons:check" :class="style.icon()" />
    </checkbox-indicator>
  </checkbox-root>
</template>
