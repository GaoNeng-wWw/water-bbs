import type { Router } from 'vue-router';
import scrollToTop from './scroll-to-top';
import profileFetch from './profile-fetch';

export function setupGuard(router: Router) {
  scrollToTop(router);
  profileFetch(router);
}
