<script lang="ts" setup>
import UnAuthAccountCard from './unauth-account-card.vue';
import authAccountCard from './authed-account-card.vue';
import topicPublishButton from './topic-publish-button.vue';
import { useAuthStore } from '@/store/auth.ts';

const authStore = useAuthStore();
</script>

<template>
  <div class="w-full h-fit py-2 px-6 sticky bg-background/20 backdrop-blur-md top-0 z-[calc(infinity+1)]">
    <div class="max-w-5xl mx-auto flex gap-3">
      <div class=" w-form-md h-form-md bg-danger-500 shrink-0" />
      <div class="grow shrink">
        <slot name="main" />
      </div>
      <div class="w-fit flex">
        <div v-if="!authStore.loggedIn" class="w-fit">
          <un-auth-account-card />
        </div>
        <div v-else class="w-fit gap-3 flex">
          <topic-publish-button />
          <auth-account-card />
        </div>
      </div>
    </div>
  </div>
</template>
