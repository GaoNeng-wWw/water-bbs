<script lang="ts" setup>
import { claimTask, UserTaskStatus } from '@/api';
import { UiButton, UiDrawerRoot, UiDrawerTrigger, UiDrawerContent } from '@/components/ui';
import taskDetail from './task-detail.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
type TaskItemProps = {
  id: string;
  title: string;
  desc?: string;
  status?: UserTaskStatus;
  canClaim?: boolean;
};

const props = defineProps<TaskItemProps>();
const router = useRouter();
const { t } = useI18n({ useScope: 'local' });

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
</script>

<template>
  <ui-drawer-root direction="right">
    <ui-drawer-trigger as-child>
      <div
        class="w-full py-2 px-4 rounded bg-surface-100 cursor-pointer transition duration-fast ease-in-out hover:bg-surface-200"
      >
        <div class="w-full flex gap-2">
          <div class="w-full flex flex-col gap-2">
            <p class="text-lg text-surface-fg">
              {{ props.title }}
            </p>
            <p class="text-sm text-surface-fg/50 mt-2 line-clamp-3">
              {{ props.desc }}
            </p>
          </div>
          <div class="flex-[1_0_auto] flex flex-col justify-between">
            <div class="w-fit">
              <div v-if="status === UserTaskStatus.PROGRESS" class="size-fit rounded-full bg-primary px-2 text-xs">
                {{ t('progress') }}
              </div>
              <div v-if="status === UserTaskStatus.COMPLETED" class="size-fit rounded-full bg-success px-2 text-xs">
                {{ t('completed') }}
              </div>
            </div>
            <div>
              <ui-button size="sm" :disabled="!props.canClaim" color="primary" @click="claim">
                {{ t('claim') }}
              </ui-button>
            </div>
          </div>
        </div>
      </div>
    </ui-drawer-trigger>
    <ui-drawer-content hidden-handle>
      <task-detail :id="props.id" />
    </ui-drawer-content>
  </ui-drawer-root>
</template>

<i18n lang="yaml">
en-us:
  progress: Progress
  completed: Completed
  claim: Claim
zh-cn:
  progress: 进行中
  completed: 已完成
  claim: 接受
</i18n>
