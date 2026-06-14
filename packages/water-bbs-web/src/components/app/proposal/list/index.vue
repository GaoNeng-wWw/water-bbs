<script setup lang="ts">
import Item from './item.vue';
import { proposalControllerListProposal, type ProposalSummary } from '@/api';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { ref } from 'vue';

const proposals = ref<ProposalSummary[]>([]);

proposalControllerListProposal({
  client: NOT_PUBLIC_ENDPOINT,
  query: {
    page: 1,
    size: 10,
  },
})
  .then(result => ({ data: result.data?.data ?? [], total: result.data?.total ?? 0 }))
  .then((result) => {
    const data = result.data as ProposalSummary[];
    const total = result.total;
    proposals.value = data;
  });
</script>

<template>
  <div class="w-full space-y-4">
    <item
      v-for="proposal of proposals"
      :id="proposal.id"
      :key="proposal.id"
      :title="proposal.title"
      :status="proposal.status"
      :created-at="proposal.createdAt"
      :end-at="proposal.endAt"
      :yes="proposal.yes"
      :no="proposal.no"
    />
  </div>
</template>
