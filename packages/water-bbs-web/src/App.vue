<script lang="ts" setup>
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import { useAccount, useUserStore } from '@/store';
import { watch } from 'vue';
import { accountControllerGetProfile } from './api';
import { NOT_PUBLIC_ENDPOINT } from './composables';
import { UiDialogRenderer, UiDrawerProvider } from '@/components/ui';

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
  <div class="w-full min-h-dvh bg-warm-50">
    <div class="min-h-full w-full mx-auto gap-0 flex flex-col">
      <toaster position="top-center" theme="system" rich-colors />
      <ui-dialog-renderer />
      <suspense>
        <ui-drawer-provider>
          <router-view />
        </ui-drawer-provider>
      </suspense>
    </div>
  </div>
</template>
