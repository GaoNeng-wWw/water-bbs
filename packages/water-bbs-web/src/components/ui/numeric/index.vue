<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { tv } from 'tailwind-variants';

const {
  size = 'md',
  color = 'default',
  variant = 'solid',
  fit = false,
} = defineProps<{
  size?: 'sm' | 'md' | 'lg';
  fit?: boolean;
  color?: 'default' | 'primary' | 'danger';
  variant?: 'solid' | 'ghost';
}>();

const emits = defineEmits<{
  focus: [FocusEvent];
  blur: [FocusEvent];
}>();
const modelValue = defineModel<number>();
const value = ref(modelValue.value);
watch(value, ()=>{
  modelValue.value = Number(value.value);
})
const style = tv({
  base: [
    'w-full flex items-center gap-4 text-warm-foreground rounded-md border border-solid transition duration-fast ease-in-out',
    'group-data-[error=true]:border-danger-200 group-data-[error=true]:hover:border-danger-300 group-data-[error=true]:text-danger-500',
    'group-data-[error=true]:font-bold', 'cursor-pointer',
  ],
  variants: {
    size: {
      sm: 'p-1 rounded text-sm',
      md: 'px-2 py-1 rounded-md text-md',
      lg: 'px-3 py-2 rounded-lg text-md',
    },
    color: {
      default: 'bg-warm-100 border-warm-200 hover:border-warm-300',
      primary: 'bg-primary-500/20 border-primary-200 hover:border-primary-300 text-primary-500 ',
      danger: 'bg-danger-500/20 border-danger-200 hover:border-danger-300 text-danger-500 font-bold',
    },
    variant: {
      solid: '',
      ghost: 'border-none',
    },
  },
  compoundVariants: [
    {
      color: 'danger',
      variant: 'ghost',
      className: 'bg-darnger-500/20 border-none hover:border-none',
    },
    {
      color: 'primary',
      variant: 'ghost',
      className: 'bg-primary-500/20 border-none hover:border-none',
    },
    {
      color: 'default',
      variant: 'ghost',
      className: 'bg-warm-100/0 hover:bg-warm-100/50 focus-within:bg-warm-100/50',
    },
  ],
});

const clazz = computed(() => style({ size, color, variant }));
</script>

<template>
  <div :class="clazz">
    <input
      v-model="value"
      type="number"
      :data-fit="fit"
      class="outline-none w-full cursor-pointer data-[fit=true]:field-sizing-content"
      @focus="(ev) => emits('focus', ev)"
      @blur="(ev) => emits('blur', ev)"
    >
  </div>
</template>

<style scoped>
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
