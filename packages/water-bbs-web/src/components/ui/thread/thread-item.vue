<script lang="ts" setup>
import { UiButton } from '@/components/ui';
</script>

<template>
  <div class="mt-4 mb-4">
    <div class="w-full flex text-warm-foreground gap-4">
      <div class="size-12 bg-red-500 rounded-full shrink-0" />
      <div>
        <span class="text-sm">Author Name</span>
        <div class="mt-4 text-warm-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus nemo fugit doloremque facere! Laborum expedita nemo obcaecati molestias doloribus iusto porro debitis voluptatem explicabo magni, veniam eum illo excepturi possimus?
        </div>
        <div class="w-full mt-4">
          <ui-button size="tiny">
            只看TA
          </ui-button>
        </div>
      </div>
    </div>
    <div class="w-full h-px bg-warm-foreground/10 mt-8" />
  </div>
</template>
