<script lang="ts" setup>
import { NOT_PUBLIC_ENDPOINT, useDialog } from '@/composables';
import { fallbackText } from '@/utils';
import { Avatar } from 'reka-ui/namespaced';
import { tv } from 'tailwind-variants';
import { h, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { computed } from 'vue';
import AvatarEditor from './avatar-editor.vue';
import { accountControllerUploadAvatar } from '@/api';

const {
  username, avatarUrl, size = 'md', editable,
} = defineProps<{
  username?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  editable?: boolean;
}>();

const style = tv({
  base: 'rounded-full bg-warm-100 border border-solid border-warm-200 data-[editable=true]:cursor-pointer shrink-0',
  slots: {
    image: 'size-full rounded-full object-cover',
    fallback: 'text-warm-foreground flex size-full items-center justify-center',
  },
  variants: {
    size: {
      xs: 'size-8',
      sm: 'size-12',
      md: 'size-16',
      lg: 'size-18',
    },
  },
});

const clazz = computed(() => style({ size })); ;
const fallback = computed(() => fallbackText(username ?? ''));
const avatarUpload = useTemplateRef('avatar-upload');
const url = ref('');
const { render } = useDialog();
const onClickUpload = () => {
  if (avatarUpload.value && !url.value) {
    avatarUpload.value.click();
  }
};

const onEditorClosed = (data: Blob) => {
  const file = new File([data], 'avatar.png');
  accountControllerUploadAvatar({
    body: { file },
    client: NOT_PUBLIC_ENDPOINT,
  })
};

const onLoadImage = (ev: ProgressEvent<FileReader>) => {
  if (!ev.target?.result) {
    return;
  }
  url.value = ev.target.result.toString();
  render<Blob>(
    h(AvatarEditor, { src: url.value }),
  )
    .then(({ data }) => onEditorClosed(data));
};

const onUploadChange = (_ev: Event) => {
  const el = avatarUpload.value;
  if (!el) {
    return;
  }
  const files = Array.from(el.files ?? []);
  const [file] = files;
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', onLoadImage);
  reader.readAsDataURL(file);
};

onMounted(() => {
  if (!avatarUpload.value) {
    return;
  }
  const el = avatarUpload.value;
  el.addEventListener('change', onUploadChange);
});

onUnmounted(() => {
  const el = avatarUpload.value;
  if (!el) {
    return;
  }
  el.removeEventListener('change', onUploadChange);
});

watch(() => avatarUrl, () => {
  if (avatarUrl) {
    url.value = avatarUrl;
  }
}, { immediate: true });
</script>

<template>
  <Avatar.Root :class="clazz.base()" :data-editable="editable ? true : undefined" @click="onClickUpload">
    <Avatar.Image :src="avatarUrl || ''" :class="clazz.image()" />
    <Avatar.Fallback :delay-ms="60" :class="clazz.fallback()" as="div">
      {{ fallback }}
    </Avatar.Fallback>
    <input
      v-if="editable"
      id="file-upload"
      ref="avatar-upload"
      type="file"
      class="fixed top-0 hidden"
    >
  </Avatar.Root>
</template>
