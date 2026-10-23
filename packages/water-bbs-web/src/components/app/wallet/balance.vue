<script lang="ts" setup>
import { getBalance } from '@/api';
import { useQuery } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });


const { data: balance, suspense } = useQuery({
  queryFn: () => {
    return getBalance({})
      .then(resp => resp.data)
      .then(wallet => wallet?.balance ?? '0');
  },
  queryKey: ['profile.balance'],
});

await suspense();
</script>

<template>
  <h1 class="text-2xl text-surface-fg">
    {{ t('balance') }}: {{ balance }}
  </h1>
</template>

<i18n lang="yaml">
  en:
    balance: Balance
  zh:
    balance: 积分
</i18n>