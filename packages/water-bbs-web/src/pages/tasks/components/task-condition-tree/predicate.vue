<script lang="ts" setup>
import type { WhenNode } from '@/types/when';
import Root from './root.vue';
import { v7 } from 'uuid';
import { useI18n } from 'vue-i18n';

export type Prop = {
  kind: string;
  expression: WhenNode[];
};
const props = defineProps<Prop>();

const { t } = useI18n({ useScope: 'local' });
</script>

<template>
  <div class="w-full">
    <div class="flex text-center text-surface-fg/80 text-sm">
      <span>{{ t(kind) }}</span>
    </div>
    <div class="flex w-full pl-8">
      <!-- eslint-disable-next-line vue/valid-v-for -->
      <root v-for="exp in expression" :key="v7()" :node="exp" />
    </div>
  </div>
</template>

<i18n lang="yaml">
en-us:
  all: "Every"
  any: "Some"
  Not: "Not"
zh-cn:
  all: "下列全部满足"
  any: "满足下列任意一项"
  Not: "不满足"
</i18n>
