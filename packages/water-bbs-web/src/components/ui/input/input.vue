<script lang="ts" setup>
import { computed, ref } from 'vue';
import { tv } from 'tailwind-variants';

const {
  password = false,
  size = 'md',
  color = 'default',
  variant = 'solid',
} = defineProps<{
  password?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'primary' | 'danger';
  variant?: 'solid' | 'ghost';
}>();

const emits = defineEmits<{
  focus: [FocusEvent];
  blur: [FocusEvent];
}>();
const inputType = computed(() => password ? 'password' : 'text');
const showPassword = ref(false);
const modelValue = defineModel();

const style = tv({
  base: [
    'w-full flex items-center gap-4 text-warm-foreground rounded-md border border-solid transition duration-fast ease-in-out',
    'group-data-[error=true]:border-danger-200 group-data-[error=true]:hover:border-danger-300 group-data-[error=true]:text-danger-500',
    'group-data-[error=true]:font-bold', 'cursor-pointer',
  ],
  variants: {
    size: {
      sm: 'p-1 rounded',
      md: 'px-2 py-1 rounded-md',
      lg: 'px-3 py-2 rounded-lg',
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
      v-model="modelValue"
      :type="inputType === 'password' ? showPassword ? 'text' : 'password' : inputType"
      class="outline-none w-full cursor-pointer"
      @focus="(ev) => emits('focus', ev)"
      @blur="(ev) => emits('blur', ev)"
    >
    <div v-if="password" class="cursor-pointer size-6">
      <div
        class="size-full i-material-symbols:visibility-off-rounded active:i-material-symbols:visibility-rounded active:size-full"
        @mousedown="showPassword = true"
        @mouseup="showPassword = false"
      />
    </div>
  </div>
</template>
