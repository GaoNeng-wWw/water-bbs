<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import { resolveControversy } from '@/api';
import { ref } from 'vue';
const { proposalId } = defineProps<{ proposalId: string }>();

const loading = ref(false);

const onClick = (kind: 'approve' | 'reject') => {
  loading.value = true;
  resolveControversy({
    path: {
      id: proposalId,
    },
    query: { kind },
  })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <div class="w-full space-x-2">
    <ui-button :loading="loading" color="danger" @click="() => onClick('approve')">
      同意
    </ui-button>
    <ui-button :loading="loading" color="warning" @click="() => onClick('reject')">
      否决
    </ui-button>
  </div>
</template>
