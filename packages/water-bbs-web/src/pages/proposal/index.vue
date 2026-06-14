<script lang="ts" setup>
import { AnimatePresence, motion } from 'motion-v';
import Sidebar from '@/components/app/shell/sidebar.vue';
import { Layout } from '@/components/ui';
import { AppProposalList } from '@/components/app';
import { useSiteStore } from '@/store/site.store';
import { storeToRefs } from 'pinia';
import { HomeHeader } from '@/components/app/shell';

const siteStore = useSiteStore();
const { isMobile, sidebarVisbility } = storeToRefs(siteStore);

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
        <div class="max-w-1200px w-full mx-auto py-4 px-4 h-full flex">
          <app-proposal-list />
        </div>
      </animate-presence>
    </div>
  </layout>
</template>
