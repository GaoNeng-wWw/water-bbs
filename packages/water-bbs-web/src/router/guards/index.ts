import type { Router } from 'vue-router';
import scrollToTop from './scroll-to-top';

export function setupGuard(router: Router) {
  scrollToTop(router);
}
