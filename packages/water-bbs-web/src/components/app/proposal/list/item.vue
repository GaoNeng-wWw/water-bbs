<script lang="ts" setup>
import { UiButton, UiTag } from '@/components/ui';
import { Progress } from 'reka-ui/namespaced';
import { computed, ref } from 'vue';

const { title, yes, no, status } = defineProps<{
  title: string;
  yes: number;
  no: number;
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  createAt: string;
}>();

const emits = defineEmits<{
  vote: ['yes' | 'no'];
}>();

const total = computed(() => yes + no);

const progress = computed(() => yes / total.value * 100);
</script>

<template>
  <div class="w-full flex flex-col gap-3 bg-warm-100 p-2.5 rounded-md border border-warm-200">
    <div class="w-full flex items-center justify-between">
      <ui-tag color="warning">
        {{ status }}
      </ui-tag>
      <div class="flex h-full gap-4 items-baseline">
        <span class="text-xs text-warm-foreground/50">{{ createAt }}</span>
        <!-- <span class="text-sm text-warning-600">还剩 8 天</span> -->
      </div>
    </div>
    <div class="w-full">
      <h1 class="text-warm-foreground text-xl font-bold px-2">
        <router-link to="/proposal/1" class="hover:text-primary-500">
          {{ title }}
        </router-link>
      </h1>
    </div>
    <div class="w-full px-2">
      <div class="w-full flex justify-between mb-2">
        <span class="text-sm text-success-500">支持 <strong>{{ yes }}</strong></span>
        <span class="text-sm text-warning-500">反对 <strong>{{ no }}</strong></span>
      </div>
      <Progress.Root class="w-full h-1.5 overflow-hidden bg-warm-200 rounded">
        <Progress.Indicator
          class="w-full h-full block bg-success-500 rounded" :style="{
            transform: `translateX(-${100 - progress}%)`,
          }"
        />
      </Progress.Root>
      <p class="text-xs text-warm-foreground/80 mt-4 text-center">
        共 {{ total }} 人投票
      </p>
    </div>
    <div class="w-full grid cols-2 gap-4">
      <ui-button full color="success" size="md" shape="ghost">
        赞成
      </ui-button>
      <ui-button full color="warning" size="md" shape="ghost">
        反对
      </ui-button>
    </div>
  </div>
</template>
