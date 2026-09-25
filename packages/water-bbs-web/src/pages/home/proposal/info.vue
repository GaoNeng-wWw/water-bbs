<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import ProposalProgress from './components/proposal-progress.vue';
import { AppNavBar } from '@/components/app';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProposalActionTree, { type ActionNode, type ParamNode } from './components/proposal-action-tree.vue';
import CommentEditor from '@/components/app/comment/comment-editor.vue';
import commentList from '@/components/app/comment/comment-list.vue';
import { useQuery } from '@tanstack/vue-query';
import { findProposal, voteProposal } from '@/api/sdk.gen.ts';
import ProposalBadge from './components/proposal-badge.vue';
import { useComment } from '@/composables';
import { proposalBadgeText, proposalBadgeColor } from '@/helper';

const router = useRouter();
const route = computed(() => router.currentRoute.value);
const id = computed(() => route.value.params.id.toString());

const { submitComment, commentSubmiting, commentID } = useComment({ resourceID: id, eager: true });

const { data } = useQuery({
  queryKey: ['proposal', 'info', id.value],
  queryFn: () => {
    return findProposal({
      path: {
        id: id.value,
      },
    })
      .then(resp => resp.data);
  },
});

const steps = computed<ActionNode[]>(() => {
  if (!data.value) {
    return [];
  }
  return data.value.step
    .map((step) => {
      const params = Object.entries(step.param)
        .map(([name, value]) => {
          return {
            type: 'param',
            id: name,
            name,
            value,
          } as ParamNode;
        });
      return {
        type: 'action',
        id: step.stepName,
        name: step.stepName,
        children: params,
      } as ActionNode;
    });
});
const createdAt = computed(() => data.value?.createdAt ? new Date(data.value.createdAt).toLocaleString() : null);

const agree = computed(() => data.value?.voteSummary.yes ?? 0);
const disagree = computed(() => data.value?.voteSummary.no ?? 0);
const loading = ref(false);

const onAgree = () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  voteProposal({
    body: {
      id: id.value,
      kind: 'Agree',
    },
  })
    .finally(() => {
      loading.value = false;
    });
};

const onDisagree = () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  voteProposal({
    body: {
      id: id.value,
      kind: 'DisAgree',
    },
  })
    .finally(() => {
      loading.value = false;
    });
};
const badgeText = computed(() => {
  const status = data.value?.status;
  return proposalBadgeText(status);
});
const color = computed(() => {
  if (!data.value) {
    return 'surface';
  }
  const status = data.value.status;
  return proposalBadgeColor(status);
});
</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="max-w-5xl flex flex-col mx-auto pt-8 pb-4 gap-8 px-5 text-surface-fg">
      <div class="w-fit">
        <ui-button size="sm" variant="ghost" @click="router.back()">
          返回
        </ui-button>
      </div>
      <div class="w-full space-y-4">
        <div class="w-full p-4 rounded-md bg-surface-100 border border-solid border-surface-200 space-y-2">
          <div class="w-full flex flex-col">
            <div class="flex items-center gap-2">
              <h1 class="text-lg">
                {{ data?.title }}
              </h1>
              <proposal-badge v-if="data" :text="badgeText" :color="color" />
              <proposal-badge v-if="data?.kind === 'emergency'" text="紧急事务" color="danger" />
            </div>
            <div class="">
              <span v-if="createdAt" class="text-xs text-surface-fg/50">创建时间: {{ createdAt }}</span>
            </div>
          </div>
          <div class="w-full flex flex-col gap-2 mt-4">
            <div class="w-full">
              {{ data?.content }}
            </div>
            <div class="w-full space-y-2">
              <p class="text-surface-fg text-lg">
                操作:
              </p>
              <proposal-action-tree :nodes="steps" />
            </div>
          </div>
          <div class="w-full grid gap-4 mt-4">
            <proposal-progress v-if="data?.kind !== 'emergency'" :agree="agree" :disagree="disagree">
              <template #meta>
                <div class="w-full flex flex-col gap-2">
                  <div class="w-full grid grid-cols-2 place-items-center">
                    <p class="text-surface-fg text-sm mt-2">
                      赞同 {{ agree }}%
                    </p>
                    <p class="text-surface-fg text-sm mt-2">
                      反对 {{ disagree }}%
                    </p>
                  </div>
                  <div class="w-full grid grid-cols-2 gap-4 mt-4">
                    <ui-button
                      type="primary" color="success" size="sm" variant="ghost"
                      :disabled="data?.status !== 'pending'" :loading="loading" @click="onAgree"
                    >
                      同意
                    </ui-button>
                    <ui-button
                      type="danger" color="danger" size="sm" variant="ghost"
                      :disabled="data?.status !== 'pending'" :loading="loading" @click="onDisagree"
                    >
                      反对
                    </ui-button>
                  </div>
                </div>
              </template>
            </proposal-progress>
          </div>
        </div>
        <div class="w-full p-4 rounded-md bg-surface-100">
          <p class="text-surface-fg text-lg mb-2">
            评论:
          </p>
          <comment-editor :loading="commentSubmiting" :cancel="false" @submit="submitComment" />
          <comment-list v-if="commentID" :comment-id="commentID" :size="20" />
        </div>
      </div>
    </div>
  </div>
</template>
