<script lang="ts" setup>
import { computed, ref } from 'vue';

const {
  password = false,
} = defineProps<{
  password?: boolean;
}>();

const inputType = computed(() => password ? 'password' : 'text');
const showPassword = ref(false);
const modelValue = defineModel();
</script>

<template>
  <div
    class="
    w-full flex items-center gap-4 py-2 px-2 text-warm-foreground
    rounded-md bg-warm-200 border border-solid border-warm-300 hover:border-warm-400 transition duration-fast ease-in-out
    group-data-[error=true]:border-danger-300 group-data-[error=true]:hover:border:danger-400 group-data-[error=true]:text-danger-500-500
    group-data-[error=true]:text-danger-500 group-data-[error=true]:font-bold
    focus:border-warm-400
  "
  >
    <input
      v-model="modelValue"
      :type="inputType === 'password' ? showPassword ? 'text' : 'password' : inputType"
      class="
        outline-none
        w-full
      "
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
