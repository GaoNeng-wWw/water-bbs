<script lang="ts" setup>
import { AvatarRoot, AvatarFallback, AvatarImage } from 'reka-ui';
import { computed } from 'vue';
import { avatarStyle } from './style';

const { url, fallbackText, size = 'md' } = defineProps<{
  url?: string;
  fallbackText: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}>();

const clazz = computed(() => avatarStyle({ size }));

defineOptions({
  inheritAttrs:true,
})

</script>

<template>
  <avatar-root :class="clazz" as="div">
    <avatar-image
      :src="url ?? ''"
      class="size-full object-cover rounded-[inherit]" :class="[$attrs.class]"
    />
    <avatar-fallback class="text-surface-fg" :delay-ms="600">
      {{ fallbackText }}
    </avatar-fallback>
  </avatar-root>
</template>
