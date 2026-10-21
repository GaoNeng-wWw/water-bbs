<script lang="ts" setup>
import { TaskList, TaskToolbar } from './components';
import { AppNavBar } from '@/components/app';
</script>

<template>
  <div class="max-w-4xl w-full mx-auto">
    <app-nav-bar />
    <div class="h-full w-full py-12 space-y-8">
      <suspense>
        <task-toolbar />
      </suspense>
      <div>
        <task-list />
      </div>
    </div>
  </div>
</template>
