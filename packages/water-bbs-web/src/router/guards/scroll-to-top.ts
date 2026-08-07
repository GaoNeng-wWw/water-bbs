import type { Router } from 'vue-router';

export default function (router: Router) {
  router.beforeEach(async (to, from) => {
    if (to.meta.scrollToTop) {
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    return true;
  });
}
