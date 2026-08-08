import { useAuthStore } from '@/store';
import { watchEffect, type Directive } from 'vue';

type AuthElement = HTMLElement & {
  __anchor?: Comment;
  __stop?: () => void;
};

/**
 * @description 确保该元素只能被登陆的用户加载
 */
export const vAuthed: Directive = {
  mounted(el: AuthElement) {
    const store = useAuthStore();
    const anchor = document.createComment('v-authed');
    el.__anchor = anchor;
    const parent = el.parentNode;

    if (!parent) {
      return;
    }

    parent.replaceChild(anchor, el);

    let mounted = false;

    el.__stop = watchEffect(() => {
      const authed = !!store.accessToken;

      if (authed && !mounted) {
        parent.replaceChild(el, anchor);
        mounted = true;
      }

      if (!authed && mounted) {
        parent.replaceChild(anchor, el);
        mounted = false;
      }
    });
  },

  unmounted(el: AuthElement) {
    el.__stop?.();
  },
};
