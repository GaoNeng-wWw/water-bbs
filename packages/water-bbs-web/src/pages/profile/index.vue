<script setup lang="ts">
import { AppNavBar } from '@/components/app';
import ProfileCard from './components/profile-card.vue';
</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="w-3xl mx-auto py-8">
      <profile-card nick-name="GaoNeng-wWw" id="..." />
    </div>
  </div>
</template>