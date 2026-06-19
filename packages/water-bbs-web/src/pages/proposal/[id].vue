<script lang="ts" setup>
import { AnimatePresence, motion } from 'motion-v';
import Sidebar from '@/components/app/shell/sidebar.vue';
import { Layout } from '@/components/ui';
import { useSiteStore } from '@/store/site.store';
import { storeToRefs } from 'pinia';
import { HomeHeader } from '@/components/app/shell';
import ProposalInfo from '@/components/app/proposal/info/index.vue';
import { ProposalCommentList } from '@/components/app/proposal';
import { proposalControllerGetProposal, proposalControllerVoteProposal, type ProposalEntity } from '@/api';
import { useRoute } from 'vue-router';
import { NOT_PUBLIC_ENDPOINT, useProposalCommentList } from '@/composables';
import { ref, Suspense } from 'vue';
import { vIntersectionObserver, vElementVisibility } from '@vueuse/components';

const siteStore = useSiteStore();
const { isMobile, sidebarVisbility } = storeToRefs(siteStore);
const route = useRoute();
const id = route.params.id.toString();

const proposal = ref<ProposalEntity>();

const { comments, loading, loadComments, loadMore } = useProposalCommentList(id);

loadComments(1);

proposalControllerGetProposal({
  path: {
    id,
  },
  client: NOT_PUBLIC_ENDPOINT,
})
  .then(resp => proposal.value = resp.data);
const onVoting = (action: 'yes' | 'no') => {
  proposalControllerVoteProposal({
    body: {
      action: action,
      content: '',
    },
    path: { id },
    client: NOT_PUBLIC_ENDPOINT,
  });
};
</script>

<template>
  <layout>
    <template #header>
      <div class="max-w-[1200px] mx-auto w-full grow">
        <home-header />
      </div>
    </template>
    <div class="max-w-[1200px] mx-auto w-full grow h-full flex">
      <animate-presence>
        <motion.div
          v-if="sidebarVisbility && !isMobile"
          class="w-250px overflow-hidden h-full py-3 overflow-auto flex-col shrink-0 hidden md:flex border-r border-warm-300 sticky top-12"
          :initial="{ width: '0', opacity: 0 }"
          :animate="{ width: '250px', opacity: 1 }"
          :exit="{ width: '0', opacity: 0 }"
        >
          <sidebar show-category-list />
        </motion.div>
        <div class="max-w-1200px w-full mx-auto py-4 px-4 h-full flex flex-col gap-4">
          <proposal-info v-if="proposal" :proposal="proposal" @vote="onVoting" />
          <suspense>
            <proposal-comment-list v-if="proposal" :comments="comments" :loading="loading" />
          </suspense>
          <div v-element-visibility="loadMore" class="w-full h-1" />
        </div>
      </animate-presence>
    </div>
  </layout>
</template>
