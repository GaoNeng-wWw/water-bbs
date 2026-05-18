<script setup lang="ts">
import ThreadItem from './thread-item.vue';
</script>

<template>
  <div class="w-full mx-auto">
    <div class="w-full h-fit sticky top-12 pt-2  bg-warm-50">
      <div class="w-full px-8 py-2">
        <h1 class="text-2xl text-warm-foreground font-bold">
          Post Title
        </h1>
      </div>
      <hr class="w-full h-px color-warm-foreground/40 mt-2">
    </div>
    <div class="w-full flex flex-col gap-2 px-8">
      <thread-item />
      <thread-item />
      <thread-item />
      <thread-item />
      <thread-item />
      <thread-item />
      <thread-item />
      <thread-item />
      <thread-item />
    </div>
  </div>
</template>
