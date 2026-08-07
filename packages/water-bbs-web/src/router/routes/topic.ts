import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/topic/:id',
    component: () => import('@/pages/topic/reply/index.vue'),
  },
] as RouteRecordRaw[];
