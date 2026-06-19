<script lang="ts" setup>
import type { ProposalEntity } from '@/api';
import { UiTiptapEditor } from '@/components/ui';
import VoteProgress from '../card/progress.vue';
import ProposalVote from '../card/vote.vue';

const { proposal } = defineProps<{ proposal: ProposalEntity }>();

const emits = defineEmits<{
  vote: ['yes' | 'no'];
}>();
</script>

<template>
  <div class="w-full">
    <div class="p-4 bg-warm-100 w-full rounded-md">
      <div v-if="proposal" class="w-full">
        <h1 class="text-4xl text-warm-foreground">
          {{ proposal.title }}
        </h1>
        <ui-tiptap-editor :content="proposal.content" content-type="markdown" readonly />
        <div class="w-full space-y-4">
          <vote-progress :yes="proposal.yes" :no="proposal.no" />
          <proposal-vote @vote="emits('vote', $event)" />
        </div>
      </div>
    </div>
  </div>
</template>
