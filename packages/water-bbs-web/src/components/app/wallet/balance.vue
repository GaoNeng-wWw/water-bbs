<script lang="ts" setup>
import { getBalance } from '@/api';
import { useQuery } from '@tanstack/vue-query';

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
    积分: {{ balance }}
  </h1>
</template>
