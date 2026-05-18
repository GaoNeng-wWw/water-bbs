<script setup lang="ts">
import { ThreadList } from '@/components/app/thread';
</script>

<template>
  <div class="w-full">
    <div class="w-full relative">
      <thread-list />
      <div class="rounded-full fixed bottom-16 right-34 text-warm-foreground bg-warm-200 aspect-ratio-square p-2 cursor-pointer">
        <div class="i-material-symbols:reply size-8 aspect-ratio-square" />
      </div>
    </div>
  </div>
</template>
