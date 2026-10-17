<script lang="ts" setup>
import { TaskList, TaskToolbar } from './components';
import { AppNavBar } from '@/components/app';
</script>

<template>
  <div class="max-w-4xl w-full mx-auto">
    <app-nav-bar />
    <div class="h-full w-full py-12">
      <task-toolbar />
      <task-list />
    </div>
  </div>
</template>
