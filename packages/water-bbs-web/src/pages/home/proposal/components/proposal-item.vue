<script lang="ts" setup>
import { computed } from 'vue';
import ProposalProgress from './proposal-progress.vue';
import { useQuery } from '@tanstack/vue-query';
import { findProposal } from '@/api';
const { id, name, endAt, agree, disagree } = defineProps<{
  id: string;
  name: string;
  endAt: string | Date;
  agree: number;
  disagree: number;
}>();

const endAtDate = computed(() => {
  return Temporal.PlainDate.from(endAt instanceof Date ? endAt.toISOString() : endAt);
});
const now = computed(() => {
  return Temporal.Now.plainDateISO();
});
const remainDay = computed(() => {
  const days = now.value.until(endAtDate.value).total({ unit: 'days' });
  return days < 0 ? `${days}天前结束` : `剩余${days}天`;
});

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
</script>

<template>
  <div class="w-full flex flex-col gap-2 bg-surface-100 p-2 rounded-md border border-solid border-surface-200 text-surface-fg">
    <div class="w-full flex gap-2 items-center">
      <router-link class="transition duration-fast hover:text-primary" to="/proposal/123">
        <p class="text-xl">
          {{ name }}
        </p>
      </router-link>
      <div class="badge">
        {{ remainDay }}
      </div>
    </div>
    <div class="w-full">
      {{ data?.content }}
    </div>
    <proposal-progress :agree="agree" :disagree="disagree" />
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
