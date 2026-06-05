<script lang="ts" setup>
import { proposalControllerListProposal, type ProposalSummary } from '@/api';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';

proposalControllerListProposal({
  client: NOT_PUBLIC_ENDPOINT,
  query: {
    page: 1,
    size: 10,
  },
})
  .then(resp => resp.data)
  .then(data => data?.data as ProposalSummary[])
</script>

<template>
  <div class="w-full h-fit">

  </div>
</template>
