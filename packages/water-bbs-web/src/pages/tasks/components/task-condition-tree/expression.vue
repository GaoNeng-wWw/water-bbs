<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { desc, done } = defineProps<{
  desc?: Record<string, string>;
  done: boolean;
}>();

const { locale } = useI18n({ useScope: 'local' });
const i18Desc = computed(() => desc ? desc[locale.value] : '');
</script>

<template>
  <div class="w-full">
    <div
      class="grid grid-cols-4 text-surface-fg/80 text-sm data-[done=true]:text-success"
      :data-done="done"
    >
      <p>{{ i18Desc }}</p>
    </div>
  </div>
</template>

<i18n lang="yaml">
en-us:
  lt: "<"
  lte: "<="
  eq: "=="
  neq: "!="
  gt: ">"
  gte: ">="
  in: In
  not_in: Not in
zh-cn:
  lt: "<"
  lte: "<="
  eq: "=="
  neq: "!="
  gt: ">"
  gte: '>='
  in: 在
  not_in: 不在
</i18n>
