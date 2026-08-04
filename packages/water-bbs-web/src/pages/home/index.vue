<script setup lang="ts">
import { AppNavBar } from '@/components/app';

</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="container mx-auto">
      <router-view />
    </div>
  </div>
</template>
