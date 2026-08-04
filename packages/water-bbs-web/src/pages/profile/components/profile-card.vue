<script lang="ts" setup>
import { Avatar } from 'reka-ui/namespaced';

const { nickName, id, bio } = defineProps<{ nickName: string; id: string; bio?: string }>();

const defaultBio = '这位成员还没有填写个人简介，但 TA 已经在社区里留下了不少精彩内容。';
</script>

<template>
  <div class="w-full p-4 bg-surface-100 rounded-xl border border-solid border-surface-200 flex">
    <div class="w-full flex gap-4">
      <Avatar.Root
        class="
          size-18 inline-flex items-center justify-center text-center rounded-full overflow-hidden bg-surface-200 text-base text-surface-fg
          shrink-0
        "
        as="div"
      >
        <Avatar.Image src="" />
        <Avatar.Fallback>
          {{ nickName }}
        </Avatar.Fallback>
      </Avatar.Root>
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
          <span class="text-surface-fg text-sm">2024 年加入</span>
        </div>
      </div>
    </div>
  </div>
</template>
