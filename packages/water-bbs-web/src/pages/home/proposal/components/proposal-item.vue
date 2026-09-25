<script lang="ts" setup>
import { computed } from 'vue';
import ProposalProgress from './proposal-progress.vue';
import ProposalBadge from './proposal-badge.vue';
import { useQuery } from '@tanstack/vue-query';
import { findProposal } from '@/api';
import { proposalBadgeColor, proposalBadgeText } from '@/helper';
const { id, name, agree, disagree } = defineProps<{
  id: string;
  name: string;
  agree: number;
  disagree: number;
}>();
const { data } = useQuery({
  queryFn: () => {
    return findProposal({
      path: {
        id,
      },
    })
      .then(resp => resp.data);
  },
  queryKey: ['findProposal', id],
});

const badgeText = computed(() => proposalBadgeText(data.value?.status));
const color = computed(() => proposalBadgeColor(data.value?.status));
</script>

<template>
  <div v-if="data" class="w-full flex flex-col gap-2 bg-surface-100 p-2 rounded-md border border-solid border-surface-200 text-surface-fg">
    <div class="w-full flex gap-2 items-center">
      <router-link class="transition duration-fast hover:text-primary" :to="`/proposal/${data.id}`">
        <p class="text-xl">
          {{ name }}
        </p>
      </router-link>
      <proposal-badge v-if="data" :text="badgeText" :color="color" />
      <proposal-badge v-if="data.kind === 'emergency'" text="紧急事务" color="danger" />
    </div>
    <div class="w-full">
      {{ data?.content }}
    </div>
    <proposal-progress v-if="data.kind !== 'emergency'" :agree="agree" :disagree="disagree" />
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
@reference "../../../../assets/style.css";

.badge {
  @apply w-fit h-fit px-1.5 py-0.5 rounded-full text-xs bg-warning-900;
}
.indicator {
  @apply rounded-full block absolute left-0 top-0 w-full h-full bg-success-500 transition-transform overflow-hidden duration-660;
  background: linear-gradient(
    to right,
    var(--color-success-500) calc(1% * attr(agreen type(<number>))),
    var(--color-danger-500) calc(1% * attr(disagreen type(<number>)))
    );
}
</style>
