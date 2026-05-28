<script lang="ts" setup>
import { AnimatePresence, motion } from 'motion-v';
import { useSiteStore } from '@/store/site.store';
import { useRouter } from 'vue-router';

const router = useRouter();

const site = useSiteStore();
</script>

<template>
  <div class="w-full h-[50px] flex items-center gap-4">
    <div class="cursor-pointer size-5 text-warm-foreground i-material-symbols:arrow-back-ios-new" @click="router.back()" />
    <animate-presence>
      <motion.h1
        v-if="site.headerTitleVisble"
        class="text-lg text-warm-foreground font-bold"
        :initial="{ opacity: 0, y: 20, filter: 'blur(5px)' }"
        :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
        :exit="{ opacity: 0, y: 20, filter: 'blur(5px)' }"
        :transition="{ type: 'spring' }"
      >
        {{ site.postTitle }}
      </motion.h1>
    </animate-presence>
  </div>
</template>
