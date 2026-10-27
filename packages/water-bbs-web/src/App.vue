<script lang="ts" setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ModalHost } from '@/composables';
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
</script>

<template>
  <div class="w-full bg-surface-50 min-h-screen">
    <suspense>
      <router-view />
    </suspense>
    <modal-host />
    <toaster position="top-center" theme="system" rich-colors />
  </div>
</template>
