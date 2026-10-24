<script lang="ts" setup>
import { AvatarRoot, AvatarFallback, AvatarImage } from 'reka-ui';
import { computed, ref } from 'vue';
import { avatarStyle } from './style';
import { createHashvatar } from 'hashvatar';

defineOptions({
  inheritAttrs: true,
});

const {
  url,
  fallbackText,
  size = 'md',
  border = true,
  editable = false,
  fullText = false,
} = defineProps<{
  url?: string;
  fallbackText: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  border?: boolean;
  editable?: boolean;
  fullText?: boolean;
}>();

const emits = defineEmits<{
  edit: [];
}>();

const avatarUrl = ref(url ?? '');
const setDefaultAvatar = (id: string) => {
  const { canvas } = createHashvatar({
    hash: id,
  });
  avatarUrl.value = canvas.toDataURL('image/webp');
};
const clazz = computed(() => avatarStyle({ size, border }));
const friendlyFallbackText = computed(() => fullText ? fallbackText : fallbackText.length <= 2 ? fallbackText : fallbackText.slice(0, 2).toUpperCase());

const onClickAvatarUpload = () => {
  emits('edit');
};
</script>

<template>
  <avatar-root :class="clazz" as="div">
    <avatar-image
      :src="avatarUrl"
      class="size-full object-cover rounded-[inherit]"
      :class="[$attrs.class]"
      @error="setDefaultAvatar(fallbackText)"
    />
    <div
      v-if="editable"
      class="
        cursor-pointer
        w-full h-full absolute inset-0 bg-black/80 opacity-0
        group-hover:opacity-100
        transition duration-fast ease-in-out flex items-center justify-center
      "
      @click="onClickAvatarUpload"
    >
      <div class="size-8 icon-[material-symbols--cloud-upload] text-surface-fg" />
    </div>
    <avatar-fallback class="text-surface-fg p-1 text-nowrap" :delay-ms="60000">
      {{ friendlyFallbackText }}
    </avatar-fallback>
  </avatar-root>
</template>
