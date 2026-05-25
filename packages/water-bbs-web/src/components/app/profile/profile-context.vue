<script lang="ts" setup>
import { computed, provide } from 'vue';
import { ProfileContextKey, type ProfileContextModelValue, type ProfileContextProps } from './profile-context.props';

const props = defineProps<ProfileContextProps>();
const emits = defineEmits<{
  fieldUpdate: [string, string];
}>();

const modelValue = defineModel<ProfileContextModelValue>({
  default: {
    avatar: '',
    nick: '',
    bio: '',
  },
});

provide(ProfileContextKey, {
  editable: computed(() => props.editable),
  setField: function <N extends keyof ProfileContextModelValue>(name: N, value: ProfileContextModelValue[N]): void {
    modelValue.value[name] = value;
    emits('fieldUpdate', name, value);
  },
  data: computed(() => modelValue.value),
});
</script>

<template>
  <div class="w-full h-full">
    <slot />
  </div>
</template>
