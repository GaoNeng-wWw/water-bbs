import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/profile',
    component: () => import('@/pages/profile/index.vue'),
  },
  {
    path: '/profile/:id',
    component: () => import('@/pages/profile/index.vue'),
  },
] as RouteRecordRaw[];
