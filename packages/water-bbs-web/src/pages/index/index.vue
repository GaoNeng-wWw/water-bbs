<script lang="ts" setup>
import { PostItem, PostList } from '@/components/app';
import Sidebar from '@/components/app/shell/sidebar.vue';
</script>

<template>
  <div class="w-full flex gap-4">
    <div class="w-200px h-[calc(100dvh_-_48px)] py-3 overflow-auto flex-col shrink-0 hidden md:flex border-r border-warm-300 sticky top-12">
      <sidebar />
    </div>
    <div class="grow h-full">
      <div class="w-full pl-4 mx-auto flex">
        <div class="w-full grow shrink">
          <post-list>
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
            <post-item />
          </post-list>
        </div>
        <div class="w-200px h-dvh shrink-0" />
      </div>
    </div>
  </div>
</template>
