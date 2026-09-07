import { createContext } from '@/composables';
import type { ComputedRef } from 'vue';

export type OnSubmitProps = {
  commentId: string;
  content: string;
  replyId?: string;
};

export type CommentListContext = {
  commentId: ComputedRef<string>;
  onSubmit: (props: OnSubmitProps) => void;
  loadingReply: ComputedRef<Set<string | undefined>>;
};

export const [provideContext, useContext] = createContext<CommentListContext>('comment-list');
