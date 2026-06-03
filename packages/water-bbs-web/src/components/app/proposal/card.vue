<script setup lang="ts">
import { accountControllerGetAccountProfile, type GetProfileResponse } from '@/api';
import { UiAvatar, UiTiptapEditor } from '@/components/ui';
import { computed, reactive } from 'vue';

const {
  accountId,
  reason,
} = defineProps<{
  accountId: string;
  reason: string;
  actionLabelTree: string;
}>();

const profile = reactive<GetProfileResponse>({
  id: '',
  username: '',
  bio: '',
  avatar: '',
});

accountControllerGetAccountProfile({
  path: {
    id: accountId,
  },
})
  .then(resp => resp.data)
  .then((data) => {
    Object.assign(profile, data);
  });
const content = computed(() => JSON.parse(reason));
</script>

<template>
  <div class="w-full h-fit">
    <div class="w-full h-fit flex flex-col">
      <div class="w-full flex items-center">
        <ui-avatar :avatar-url="profile.avatar" :username="profile.username" />
        <span class="text-lg">{{ profile.username }}</span>
      </div>
      <ui-tiptap-editor :content="content" readonly />
    </div>
  </div>
</template>
