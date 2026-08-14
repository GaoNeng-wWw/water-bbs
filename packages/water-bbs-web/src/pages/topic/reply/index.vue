<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import { AppNavBar } from '@/components/app';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import ReplyCardListSkeleton from './component/reply-card-list.skeleton.vue';
import replyCardList from './component/reply-card-list.vue';
import { useMutation } from '@tanstack/vue-query';
import { createReply } from '@/api/sdk.gen.ts';

const postTitle = useTemplateRef('post-title');
const router = useRouter();

const topicId = ref(router.currentRoute.value.params.id.toString());
const page = computed(() => Number(router.currentRoute.value.query.page) || 1);
const size = computed(() => Number(router.currentRoute.value.query.size) || 20);
const opacity = ref(0);
const blur = ref('0');

const onScroll = (_ev: Event) => {
  const el = postTitle.value;
  if (!el) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const rawBlur = rect.y / rect.height;
  const op = (1 - rect.y / rect.height);
  opacity.value = op > 1 ? 1 : op < 0 ? 0 : op;
  blur.value = `${rawBlur}px`;
};

const { mutate, status } = useMutation({
  mutationFn: (content: string) => {
    return createReply({
      body: {
        content,
      },
      path: {
        topicId: topicId.value,
      },
    })
      .then(resp => resp.data)
      .then(resp => resp!);
  },
  onSuccess(_data, _variables, _onMutateResult, context) {
    context.client.invalidateQueries({ queryKey: context.mutationKey || ['replies', 'topic-id', topicId, 'page', page, 'size', size] });
  },
});

const onClickBack = () => {
  router.back();
};
const onPageUpdate = (page: number) => {
  router.push({ path: router.currentRoute.value.path, query: { page, size: size.value }, replace: true });
};
const publishReplly = (content: string) => {
  mutate(content);
};

onMounted(() => {
  document.getRootNode().addEventListener('scroll', onScroll);
});
</script>

<template>
  <div class="w-full">
    <app-nav-bar>
      <template #main>
        <div class="size-full flex items-center justify-center">
          <span
            class="text-3xl text-surface-fg opacity-(--opacity)"
            :style="{ '--opacity': opacity }"
          >Title</span>
        </div>
      </template>
    </app-nav-bar>
    <div class="max-w-5xl mx-auto py-4 px-2">
      <div class="w-full">
        <div class="w-full bg-bg border-x border-t border-surface-200 p-4 rounded-t-lg flex items-center gap-3">
          <ui-button icon size="sm" variant="text" @click="onClickBack">
            <div class="size-4 icon-[material-symbols--keyboard-arrow-left] text-surface-fg" />
          </ui-button>
          <h1 ref="post-title" class="text-3xl text-surface-fg">
            Title
          </h1>
        </div>
        <suspense>
          <reply-card-list
            v-model="page"
            :size="size"
            :topic-id="topicId"
            :publish-loading="status === 'pending'"
            @update:model-value="onPageUpdate"
            @publish-reply="publishReplly"
          />
          <template #fallback>
            <reply-card-list-skeleton :size="size" />
          </template>
        </suspense>
      </div>
    </div>
  </div>
</template>
