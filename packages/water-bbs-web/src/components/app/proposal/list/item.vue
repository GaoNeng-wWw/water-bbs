<script lang="ts" setup>
import ProposalVote from '../card/vote.vue';
import ProposalCard from '../card/index.vue';

const props = defineProps<{
  id: string;
  title: string;
  yes: number;
  no: number;
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  createdAt: string;
  endAt: string;
}>();

const emits = defineEmits<{
  vote: ['yes' | 'no'];
}>();
</script>

<template>
  <div class="w-full flex flex-col gap-3 bg-warm-100 p-2.5 rounded-md border border-warm-200">
    <proposal-card v-bind="props" />
    <proposal-vote @vote="emits('vote', $event)" />
  </div>
</template>
