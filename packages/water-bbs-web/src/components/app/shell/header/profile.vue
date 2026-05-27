<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import { motion, AnimatePresence } from 'motion-v';
import { useSiteStore } from '@/store/site.store';
import { storeToRefs } from 'pinia';
import AccountCard from '../../account/account-card.vue';
import HeaderLayout from '../header.vue';

const siteStore = useSiteStore();
const { postTitle, headerTitleVisble } = storeToRefs(siteStore);
</script>

<template>
  <div class="w-full h-full flex items-center justify-between max-w-3xl mx-auto">
    <div class="flex w-fit h-full">
      <ui-button icon size="sm" @click="siteStore.onClickMenuIcon">
        <div class="i-material-symbols:menu size-7 text-warm-foreground" />
      </ui-button>
    </div>
    <div class="w-fit">
      <account-card />
    </div>
  </div>
</template>
