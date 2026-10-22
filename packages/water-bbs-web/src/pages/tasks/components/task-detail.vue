<script lang="ts" setup>
import { cancelTask, claimTask, deliverTask, getTaskDetail, getTaskProgress, removeTask, UserTaskStatus } from '@/api';
import { computed } from 'vue';
import taskConditionTree from './task-condition-tree/root.vue';
import TaskRewards from './task-rewards.vue';
import { useI18n } from 'vue-i18n';
import { provideTaskConditionContext } from './task-condition-tree/context.ts';
import { UiButton } from '@/components/ui/index.ts';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: string }>();

const detailFetcher = await getTaskDetail({
  path: {
    id: props.id,
  },
});
const progressFetcher = await getTaskProgress({
  path: {
    id: props.id,
  },
});
const taskDetail = computed(() => detailFetcher.data);
const status = computed(() => taskDetail.value?.status);
const canClaim = computed(() => taskDetail.value?.canClaim);
const progress = computed(() => progressFetcher.error ? null : progressFetcher.data?.items);
const condition = computed(() => taskDetail.value?.condition as any);
const rewards = computed(() => taskDetail.value?.reward);
const router = useRouter();

const { t } = useI18n({ useScope: 'local', inheritLocale: true });

const claim = () => {
  claimTask({
    path: {
      id: props.id,
    },
  })
    .then(() => {
      router.go(0);
    });
};

const variable = computed(() => {
  return (progress.value ?? []).reduce((pre, cur) => {
    return {
      ...pre,
      [cur.field]: cur.value,
    };
  }, {});
});

const deliver = () => {
  deliverTask({
    path: {
      id: props.id,
    },
  })
    .then(() => {
      router.go(0);
    });
};
const cancel = () => {
  cancelTask({
    path: {
      id: props.id,
    },
  })
    .then(() => {
      router.go(0);
    });
};
const deleteTask = () => {
  removeTask({
    path: {
      id: props.id,
    },
  })
    .then(() => {
      router.go(0);
    });
};
provideTaskConditionContext({
  variable,
});
</script>

<template>
  <div class="h-full grid grid-rows-[1fr_min-content]">
    <div v-if="taskDetail" class="w-full">
      <div class="w-full flex justify-between">
        <h1 class="text-3xl text-surface-fg">
          {{ taskDetail.name }}
        </h1>
        <ui-button icon size="sm" color="danger" variant="ghost" @click="deleteTask">
          <div class="icon-[material-symbols--delete-outline] size-6" />
        </ui-button>
      </div>
      <p class="text-sm text-surface-fg/50 my-2 line-clamp-3">
        {{ taskDetail.desc }}
      </p>
      <p class="text-surface-fg mb-2">
        {{ t('condition.title') }}
      </p>
      <div class="px-4">
        <task-condition-tree v-if="condition" :node="condition" />
      </div>
      <div class="mt-2">
        <task-rewards v-if="rewards" :rewards="rewards" />
      </div>
    </div>
    <div class="w-full h-fit">
      <ui-button v-if="canClaim" :disabled="!canClaim" color="primary" @click="claim">
        {{ t('condition.action.claim') }}
      </ui-button>
      <div v-if="status && status === UserTaskStatus.PROGRESS" class="w-full space-x-2">
        <ui-button color="primary" @click="deliver">
          {{ t('condition.action.deliver') }}
        </ui-button>
        <ui-button color="danger" @click="cancel">
          {{ t('condition.action.cancel') }}
        </ui-button>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
en-us:
  condition:
    title: Condition
    action:
      claim: Claim
      deliver: Deliver
      cancel: Cancel
zh-cn:
  condition:
    title: 任务条件
    action:
      claim: 认领
      deliver: 交付
      cancel: 取消
</i18n>
