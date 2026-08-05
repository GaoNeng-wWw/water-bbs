<script lang="ts" setup>
import { injectFormItem } from '../form-item.props';

export type FieldProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
};

const { size = 'md', ...props } = defineProps<FieldProps>();
const {invalid} = injectFormItem();
</script>

<template>
  <div
    class="field"
    :data-size="size"
    :data-disabled="props.disabled || undefined"
    :data-loading="loading || undefined"
    :data-invalid="invalid || undefined"
  >
    <slot />
  </div>
</template>

<style scoped>
@reference "tailwindcss";
@reference "../../../../assets/style.css";

.field {
  @apply w-full inline-flex items-center bg-surface-100 border border-solid border-surface-200 text-surface-fg;
  &:hover{
    @apply bg-surface-50;
  }
  &[data-loading] {
    @apply opacity-80;
  }
  &[data-disabled] {
    @apply bg-surface-100/80 text-surface-800 pointer-events-none;
  }
  &[data-invalid] {
    @apply text-danger ring-danger ring-2;
    &:hover {
      @apply border-danger-600;
    }
  }
  &[data-size="xs"] {@apply h-form-xs px-0.5 rounded-xs;}
  &[data-size="sm"] {@apply h-form-sm px-1 rounded-sm;}
  &[data-size="md"] {@apply h-form-md px-2 rounded-md;}
  &[data-size="lg"] {@apply h-form-lg px-3 rounded-lg;}
}
</style>
