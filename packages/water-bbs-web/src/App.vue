<script lang="ts" setup>
import { useAccount, useUserStore } from '@/store';
import { watch } from 'vue';
import { accountControllerGetProfile } from './api';
import { NOT_PUBLIC_ENDPOINT } from './composables';

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
  <div class="w-full h-dvh bg-warm-50">
    <router-view />
  </div>
</template>
