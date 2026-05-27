<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import { motion, AnimatePresence } from 'motion-v';
import { useSiteStore } from '@/store/site.store';
import AccountCard from '../../account/account-card.vue';

const siteStore = useSiteStore();
</script>

<template>
  <div class="w-full h-full flex items-center justify-between">
    <div class="size-fit flex items-center justify-between">
      <animate-presence>
        <motion.div
          v-if="siteStore.sidebarVisbility && !siteStore.isMobile"
          class="w-220px hidden md:block"
          :initial="{ width: '0', opacity: 0 }"
          :animate="{ width: '220px', opacity: 1 }"
          :exit="{ width: '0', opacity: 0 }"
        />
      </animate-presence>
      <ui-button icon size="sm" @click="siteStore.onClickMenuIcon">
        <div class="i-material-symbols:menu size-7 text-warm-foreground" />
      </ui-button>
    </div>
    <div class="size-fit">
      <account-card />
    </div>
  </div>
</template>
