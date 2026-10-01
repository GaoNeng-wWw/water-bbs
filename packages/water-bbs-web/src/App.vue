<script lang="ts" setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ModalHost } from '@/composables';
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
</script>

<template>
  <div class="w-full bg-surface-50 min-h-screen">
    <suspense>
      <router-view />
    </suspense>
    <modal-host />
  </div>
</template>
