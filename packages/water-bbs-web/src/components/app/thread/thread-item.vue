<script lang="ts" setup>
import { UiButton } from '@/components/ui';
</script>

<template>
  <div class="w-full">
    <div class="flex py-4 gap-3">
      <div class="size-12 bg-red rounded-full shrink-0 sticky top-0" />
      <div class="min-w-0 w-full grow flex flex-col gap-2">
        <div class="w-full">
          <p class="text-warm-foreground text-sm">
            AuthorName
          </p>
          <p class="text-sm text-warm-foreground/50">
            xxxx/xx/xx
          </p>
        </div>
        <div class="w-full text-warm-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, cupiditate eveniet! Repellendus, reiciendis maxime? Nemo veniam at, eligendi odio non mollitia tenetur a, amet repudiandae dolorum quidem esse consequatur odit?
        </div>
      </div>
    </div>
    <hr class="w-full text-warm-foreground/20">
  </div>
</template>
