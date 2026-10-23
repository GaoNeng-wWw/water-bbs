<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  rewards: Record<string, any>[];
}>();

const { locale, t } = useI18n({ useScope: 'local' });

const reward = computed(() => props.rewards.map(r => r[locale.value]));
</script>

<template>
  <div>
    <p class="text-surface-fg mb-2">{{ t('title') }}</p>
    <ul class="px-4">
      <li v-for="(r, idx) in reward" :key="idx" class="text-surface-fg/80 text-sm">
        {{ r }}
      </li>
    </ul>
  </div>
</template>

<i18n lang="yaml">
en-us:
  title: Reward
zh-cn:
  title: 任务奖励
</i18n>
