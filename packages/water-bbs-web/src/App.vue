<script lang="ts" setup>
import { useAccount, useUserStore } from '@/store';
import { watch } from 'vue';
import { accountControllerGetProfile } from './api';
import { NOT_PUBLIC_ENDPOINT } from './composables';
import Sidebar from '@/components/app/shell/sidebar.vue';

const accountStore = useAccount();
const userStore = useUserStore();

watch(() => accountStore.isLogged, () => {
  accountControllerGetProfile({ client: NOT_PUBLIC_ENDPOINT })
    .then((resp) => {
      if (!resp.data) {
        return;
      }
      userStore.setProfile(resp.data);
    });
}, { immediate: true });
</script>

<template>
  <div class="w-full h-dvh bg-warm-50 overflow-auto">
    <div class="min-h-full w-full mx-auto gap-0 flex flex-col">
      <div class="w-full h-12 flex border-b border-warm-300 shrink-0 sticky top-0 bg-warm-50 z-10" />
      <div class="w-full flex grow max-w-[1440px] mx-auto">
        <div class="w-200px h-[calc(100dvh_-_48px)] py-3 overflow-auto flex-col shrink-0 hidden lg:flex border-r border-warm-300 sticky top-12">
          <sidebar />
        </div>
        <div class="grow h-full">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
