<script lang="ts" setup>
import { UiButton } from '@/components/ui';

const emits = defineEmits<{
  vote: ['yes' | 'no'];
}>();
</script>

<template>
  <div class="w-full grid cols-2 gap-4">
    <ui-button full color="success" size="md" shape="ghost" @click="() => emits('vote', 'yes')">
      Agree
    </ui-button>
    <ui-button full color="warning" size="md" shape="ghost" @click="() => emits('vote', 'no')">
      Reject
    </ui-button>
  </div>
</template>
