import { useGovernance } from '@/store/governance';
import { watchEffect, type Directive } from 'vue';

/**
 * @description 治理成员类型
 */
export const enum GovernanceMemberKind {
  Admin = 'admin',
  Bd = 'bd',
}

type GovernanceMemberElement = HTMLElement & {
  __governance_member_anchor?: Comment;
  __governance_member_stop?: () => void;
};

/**
 * @description 根据治理成员类型判断是否显示. 如果 binding 为空. 用户必须是治理成员. 否则按照传入的枚举来判断是否有资格显示.
 */
export const vGovernanceMember = {
  mounted(el, binding) {
    const anchor = document.createComment('v-governance-member-anchor');
    el.__governance_member_anchor = anchor;
    const { isAdmin, isBd, canGovernanced } = useGovernance();
    const pa = el.parentNode;
    if (!pa) {
      return;
    }
    pa.replaceChild(anchor, el);
    el.__governance_member_stop = watchEffect(() => {
      if (isAdmin()) {
        pa.replaceChild(el, anchor);
      }
      if (!binding && canGovernanced()) {
        pa.replaceChild(el, anchor);
        return;
      }
      if (isBd() && binding.value === GovernanceMemberKind.Bd) {
        pa.replaceChild(el, anchor);
      }
    });
  },
  unmounted(el) {
    el.__governance_member_stop?.();
  },
} as Directive<GovernanceMemberElement, GovernanceMemberKind | undefined>;
