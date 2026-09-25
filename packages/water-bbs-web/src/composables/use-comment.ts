import { createCommentReply, getCommentByResourceId } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { useToggle } from '@vueuse/core';
import { computed, readonly, toValue, type MaybeRefOrGetter } from 'vue';

export type UseCommentProps = {
  resourceID: MaybeRefOrGetter<string>;
  eager?: MaybeRefOrGetter<boolean>;
};

export const useComment = (props: UseCommentProps) => {
  const resourceID = computed(() => toValue(props.resourceID));
  const eager = computed(() => toValue(props.eager ?? true));
  const [commentSubmiting, setCommentSubmiting] = useToggle(false);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: computed(() => ['comments', 'resource-id', toValue(resourceID)]),
    queryFn: async () => {
      const resp = await getCommentByResourceId({
        path: { resourceID: resourceID.value },
      });
      return resp.data;
    },
    enabled: eager,
    gcTime: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
  const commentID = computed(() => query.data.value?.id ?? null);
  const submitComment = (content: string, parentID?: string) => {
    if (!commentID.value) {
      return Promise.reject('Comment ID should not be null');
    }
    if (commentSubmiting.value) {
      return;
    }
    setCommentSubmiting(true);
    return createCommentReply({
      query: parentID ? { parentId: parentID } : undefined,
      body: { content },
      path: { commentId: commentID.value },
    })
      .then(resp => resp.data!)
      .then((data) => {
        return client.invalidateQueries(() => {
          return {
            queryKey: ['comments', 'resource-id', commentID],
          };
        })
          .then(() => data);
      });
  };
  const fetchComment = () => {
    if (query.isFetching.value) {
      return;
    }
    return query.refetch();
  };
  return { commentID, fetchComment, submitComment, commentFetching: readonly(query.isFetching), commentSubmiting: readonly(commentSubmiting) };
};
