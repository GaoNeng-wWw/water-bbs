import type { Router } from 'vue-router';
import { toast } from 'vue-sonner';

export default (router: Router) => {
  router.beforeEach((to, from) => {
    if (to.meta.wip) {
      toast.warning('页面正在施工');
      return from;
    }
    return;
  });
};
