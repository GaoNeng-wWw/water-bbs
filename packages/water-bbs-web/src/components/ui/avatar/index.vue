<script lang="ts" setup>
import { AvatarRoot, AvatarFallback, AvatarImage } from 'reka-ui';
import { computed } from 'vue';
import { avatarStyle } from './style';

defineOptions({
  inheritAttrs: true,
});

const { url, fallbackText, size = 'md' } = defineProps<{
  url?: string;
  fallbackText: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}>();

const clazz = computed(() => avatarStyle({ size }));
const friendlyFallbackText = computed(() => fallbackText.length <= 2 ? fallbackText : fallbackText.slice(0,2));
</script>

<template>
  <avatar-root :class="clazz" as="div">
    <avatar-image
      :src="url ?? ''"
      class="size-full object-cover rounded-[inherit]" :class="[$attrs.class]"
    />
    <avatar-fallback class="text-surface-fg p-1 text-nowrap" :delay-ms="600">
      {{ friendlyFallbackText }}
    </avatar-fallback>
  </avatar-root>
</template>
