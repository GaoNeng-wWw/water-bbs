<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { useSiteStore } from '@/store/site.store';
import { storeToRefs } from 'pinia';

const siteStore = useSiteStore();
const { postTitle, headerTitleVisble } = storeToRefs(siteStore);
</script>

<template>
  <div class="w-full h-16 flex border-b border-warm-300 shrink-0 sticky top-0 bg-warm-50 z-10 items-center">
    <div class="container mx-auto">
      <div class="max-w-4xl mx-auto px-4 sm:px-0">
        <animate-presence>
          <motion.h1
            v-if="headerTitleVisble"
            class="text-3xl text-warm-foreground font-bold"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
          >
            {{ postTitle }}
          </motion.h1>
        </animate-presence>
      </div>
    </div>
  </div>
</template>
