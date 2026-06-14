<script lang="ts" setup>
import { AnimatePresence, motion } from 'motion-v';
import { useSiteStore } from '@/store/site.store';
import { useRouter } from 'vue-router';
import { UiButton } from '@/components/ui';
import ReportPostButton from '../../post/report-post-button.vue';

const props = defineProps<{ id: string }>();
const router = useRouter();
const site = useSiteStore();
</script>

<template>
  <div class="w-full h-[50px] flex items-center gap-4">
    <ui-button icon size="sm" @click="router.back()">
      <div class="cursor-pointer text-warm-foreground i-material-symbols:arrow-back-ios-new" />
    </ui-button>
    <animate-presence>
      <motion.div class="w-full flex justify-between">
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
        <report-post-button
          v-if="site.headerTitleVisble"
          :id="props.id"
        />
      </motion.div>
    </animate-presence>
  </div>
</template>
