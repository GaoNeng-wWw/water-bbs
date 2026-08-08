import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/profile',
    component: () => import('@/pages/profile/index.vue'),
    meta: {
      scrollToTop: true,
    },
  },
  {
    path: '/profile/:id',
    component: () => import('@/pages/profile/index.vue'),
    meta: {
      scrollToTop: true,
    },
  },
] as RouteRecordRaw[];
