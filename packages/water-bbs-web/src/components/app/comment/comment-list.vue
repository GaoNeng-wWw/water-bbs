<script lang="ts" setup>
import { getReplyTree, createCommentReply } from '@/api';
import { useInfiniteQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { vElementVisibility } from '@vueuse/components';
import commentItem from './comment-item.vue';
import { provideContext, type OnSubmitProps } from './context.ts';

const { commentId, size, parentId } = defineProps<{
  commentId: string;
  size: number;
  parentId?: string;
}>();

const loadingReply = ref(new Set<string | undefined>([]));

const client = useQueryClient();

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isPending } = useInfiniteQuery({
  queryFn: ({ pageParam }) => {
    return getReplyTree({
      query: { commentId, size, parentId, cursor: pageParam },
    });
  },
  queryKey: ['comment', 'reply-tree', commentId, size, parentId],
  getNextPageParam: (param) => {
    return param.data?.meta.nextCursor ?? undefined;
  },
  initialPageParam: undefined as string | undefined,
  suspense: true,
  gcTime: 5 * 60 * 1000,
  staleTime: 60 * 1000,
});

const pages = computed(() => {
  const pages = data.value?.pages ?? [];
  return pages
    .map(page => page.data)
    .filter(tree => tree !== undefined)
    .flatMap(tree => tree);
});

const loadMore = (visible: boolean) => {
  if (
    !visible
    || !hasNextPage.value
    || isFetchingNextPage.value
  ) {
    return;
  }
  fetchNextPage();
};

const onSubmit = ({ commentId, replyId, content }: OnSubmitProps) => {
  loadingReply.value.add(replyId);
  createCommentReply({
    query: {
      parentId: replyId,
    },
    body: {
      content,
    },
    path: {
      commentId,
    },
  })
    .then(resp => resp.data!)
    .then(() => {
      return client.invalidateQueries(() => {
        return {
          queryKey: ['comment', 'reply-tree', commentId, size, replyId],
        };
      });
    })
    .finally(() => {
      loadingReply.value.delete(replyId);
      refetch();
    });
};

provideContext({
  commentId: computed(() => commentId),
  onSubmit,
  loadingReply: computed(() => loadingReply.value),
});
</script>

<template>
  <div class="w-full">
    <div v-for="tree, idx of pages" :key="idx" class="space-y-3">
      <div v-for="node of tree.nodes" :key="node.id" class="flex flex-col gap-3">
        <comment-item
          :reply-id="node.id"
          :author-id="node.author.id as unknown as string"
          :nick="node.author.nick"
          :content="node.content"
          :expandable="node.expandable"
          :loading="isPending"
        />
      </div>
    </div>
    <div v-if="isPending" class="w-full min-h-32 flex items-center justify-center">
      <div class="size-4 icon-[eos-icons--loading] text-surface-fg" />
    </div>
    <div v-element-visibility="loadMore" class="w-full h-px" />
  </div>
</template>
