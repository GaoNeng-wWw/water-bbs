<script lang="ts" setup>
import { useAccount, useUserStore } from '@/store';
import { watch } from 'vue';
import { accountControllerGetProfile } from './api';
import { NOT_PUBLIC_ENDPOINT } from './composables';
import AppHeader from './components/app/shell/header.vue';

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
  <div class="w-full bg-warm-50">
    <div class="min-h-full w-full mx-auto gap-0 flex flex-col">
      <app-header />
      <suspense>
        <router-view />
      </suspense>
    </div>
  </div>
</template>
