<script setup lang="ts">
import { CategoryList } from '@/components/app';
import AccountCard from '../account/account-card.vue';
</script>

<template>
  <div class="w-full h-full py-4 overflow-auto flex flex-col">
    <div class="w-full h-full grow overflow-auto">
      <category-list />
    </div>
    <div class="w-full h-fit">
      <account-card />
    </div>
  </div>
</template>
