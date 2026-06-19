import { proposalControllerCreateProposalComment, proposalControllerListProposalComments, type ProposalComment } from '@/api';
import { computed, reactive, ref } from 'vue';
import { NOT_PUBLIC_ENDPOINT } from './use-api';

export type UseProposalCommentListState = {
  page: number;
  size: number;
  total: number;
  comments: ProposalComment[];
  loading: boolean;
  done: boolean;
};

export const useProposalCommentList = (
  id: string,
) => {
  const state = reactive<UseProposalCommentListState>({
    page: 1,
    size: 20,
    total: 0,
    comments: [],
    loading: false,
    done: false,
  });
  const loadComments = (page: number) => {
    state.loading = true;
    return proposalControllerListProposalComments({
      query: {
        page,
        size: state.size,
      },
      path: { id },
      client: NOT_PUBLIC_ENDPOINT,
    })
      .then(resp => resp.data ?? { data: [], total: 0 })
      .then(({ data, total }) => {
        state.comments.push(...data as ProposalComment[]);
        state.total = total;
        state.done = !data.length;
      })
      .finally(() => {
        state.loading = false;
      });
  };
  const createComment = (
    content: string,
  ) => {
    proposalControllerCreateProposalComment({
      path: { id },
      body: {
        content,
      },
      client: NOT_PUBLIC_ENDPOINT,
    })
      .finally(() => {
        state.loading = false;
      });
  };
  const loadMore = () => {
    if (state.loading || state.done) {
      return;
    }
    state.loading = true;
    state.page += 1;
    loadComments(state.page);
  };
  return {
    comments: computed(() => state.comments),
    loading: computed(() => state.loading),
    loadMore,
    createComment,
    loadComments,
  };
};
