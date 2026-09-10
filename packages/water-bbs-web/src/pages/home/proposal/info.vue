<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import ProposalProgress from './components/proposal-progress.vue';
import { AppNavBar } from '@/components/app';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProposalActionTree, { type ActionNode } from './components/proposal-action-tree.vue';
import CommentEditor from '@/components/app/comment/comment-editor.vue';

const router = useRouter();
const route = computed(() => router.currentRoute.value);
const id = computed(() => route.value.params.id.toString());

const proposal = ref<ActionNode[]>([
  {
    id: '1',
    type: 'action',
    name: 'Add User',
    children: [
      {
        id: '1-1',
        type: 'param',
        name: 'username',
        value: 'admin',
      },
    ],
  },
  {
    id: '2',
    type: 'action',
    name: 'Delete User',
  },
]);

const agree = ref(50);
const disagree = ref(50);

const onAgree = () => {
  console.log('同意');
};

const onDisagree = () => {
  console.log('反对');
};
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
        <div class="w-full p-4 rounded-md bg-surface-100 border border-solid border-surface-200">
          <div class="w-full flex flex-col">
            <h1 class="text-lg">
              Proposal
            </h1>
            <span class="text-xs text-surface-fg/50">创建时间: 2026年09月09日</span>
          </div>
          <div class="w-full flex flex-col gap-2 mt-4">
            <div class="w-full">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid earum molestiae sapiente suscipit maiores consectetur dolore incidunt voluptates hic eaque magni adipisci explicabo veniam nam sunt, optio error non quisquam.
            </div>
            <div class="w-full space-y-2">
              <p class="text-surface-fg text-lg">
                操作:
              </p>
              <proposal-action-tree :nodes="proposal" />
            </div>
          </div>
          <div class="w-full grid gap-4 mt-4">
            <proposal-progress :agree="agree" :disagree="disagree">
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
                    <ui-button type="primary" color="success" size="sm" variant="ghost" @click="onAgree">
                      同意
                    </ui-button>
                    <ui-button type="danger" color="danger" size="sm" variant="ghost" @click="onDisagree">
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
          <comment-editor />
        </div>
      </div>
    </div>
  </div>
</template>
