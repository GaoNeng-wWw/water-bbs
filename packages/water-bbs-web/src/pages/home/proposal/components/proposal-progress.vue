<script lang="ts" setup>
import { computed } from 'vue';
import { ProgressRoot } from 'reka-ui';

const props = defineProps<{
  agree: number;
  disagree: number;
}>();

const total = computed(() => props.agree + props.disagree);

const agreePercent = computed(() =>
  total.value > 0 ? (props.agree / total.value) * 100 : 0,
);
const disagreePercent = computed(() =>
  total.value > 0 ? (props.disagree / total.value) * 100 : 0,
);
</script>

<template>
  <div class="vote-bar">
    <progress-root class="vote-bar__track">
      <div
        class="vote-bar__fill vote-bar__fill--agree"
        :style="{ width: `${agreePercent}%` }"
      />
      <div
        class="vote-bar__fill vote-bar__fill--disagree"
        :style="{ width: `${disagreePercent}%` }"
      />
    </progress-root>

    <slot name="meta" :agree="agree" :disagree="disagree" :total="total" :agree-percent="agreePercent.toFixed(0)" :disagree-percent="disagreePercent.toFixed(0)">
      <div class="vote-bar__meta">
        <div class="vote-bar__value">
          支持: {{ agreePercent.toFixed(0) }}%
        </div>
        <div class="vote-bar__value">
          反对: {{ disagreePercent.toFixed(0) }}%
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.vote-bar {
  width: 100%;
}

/* 轨道 */
.vote-bar__track {
  position: relative;
  display: block;
  height: 0.5rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  border: 1px solid var(--color-surface-200, #e5e7eb);
  background-color: var(--color-surface-50, #f9fafb);
}

/* 填充条通用 */
.vote-bar__fill {
  position: absolute;
  top: 0;
  bottom: 0;
  transition: width 500ms ease-out;
  will-change: width;
}

/* 赞成：从左往右 */
.vote-bar__fill--agree {
  left: 0;
  background-color: var(--color-success-500, #22c55e);
}

/* 反对：从右往左 */
.vote-bar__fill--disagree {
  right: 0;
  background-color: var(--color-danger-500, #ef4444);
}

/* 底部百分比 */
.vote-bar__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  margin-top: 0.5rem;
}

.vote-bar__value {
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
