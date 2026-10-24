<script lang="ts" setup>
import { UiAvatar } from '@/components/ui';
import { useProfile } from '@/store';
import { useFileDialog } from '@vueuse/core';
import { uploadAvatar } from '@/api';
import { useRouter } from 'vue-router';

const {
  nickName,
  bio,
  createTime,
  id,
} = defineProps<{ nickName: string; id: string; bio?: string; createTime: string }>();

const profile = useProfile();
const defaultBio = '这位成员还没有填写个人简介，但 TA 已经在社区里留下了不少精彩内容。';
const year = new Date(createTime).getFullYear();
const { open, onChange } = useFileDialog();
const onClickAvatarUpload = () => {
  open({
    accept: 'image/*',
  });
};
const router = useRouter();
onChange((file) => {
  if (!file || file.length < 1) {
    return;
  }
  const [avatar] = file;
  uploadAvatar({
    body: {
      file: avatar,
    },
  })
    .finally(() => { return router.go(0); });
});
</script>

<template>
  <div class="w-full p-4 bg-surface-100 rounded-xl border border-solid border-surface-200 flex">
    <div class="w-full flex gap-4">
      <ui-avatar
        :fallback-text="nickName"
        class="size-18"
        full-text
        :editable="profile.profile?.id.toString() === id?.toString()"
        :url="`/__avatar__/${id}`"
        @edit="onClickAvatarUpload"
      />
      <div class="grow flex flex-col space-y-4">
        <div class="w-full space-y-3">
          <p class="text-xl text-surface-fg">
            {{ nickName }}
          </p>
          <p class="text-sm text-surface-fg/50">
            {{ bio ?? defaultBio }}
          </p>
        </div>
        <div class="w-fit px-2 rounded-full bg-surface-200 border border-solid border-surface-300">
          <span class="text-surface-fg text-sm">{{ year }} 年加入</span>
        </div>
      </div>
    </div>
  </div>
</template>
