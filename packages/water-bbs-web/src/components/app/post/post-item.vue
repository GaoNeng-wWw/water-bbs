<template>
  <div class="w-full h-fit py-3 border-b border-warm-200 flex gap-2 text-warm-foreground">
    <div class="size-12 bg-red shrink-0 rounded-full" />
    <div>
      <router-link class="text-base cursor-pointer hover:text-primary-500" to="/post/example">
        hello world
      </router-link>
      <div class="w-full flex items-center mt-1 text-xs space-x-4">
        <span>Test User</span>
        <span>2026/05/17</span>
      </div>
    </div>
  </div>
</template>
