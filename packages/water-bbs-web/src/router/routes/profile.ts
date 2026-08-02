import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/profile/:id',
    component: () => import('@/pages/profile/index.vue'),
  },
] as RouteRecordRaw[];
