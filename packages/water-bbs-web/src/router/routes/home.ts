import type { RouteRecord } from 'vue-router';

export default [
  {
    path: '/:id?',
    component: () => import('@/pages/home/index.vue'),
  },
] as unknown as RouteRecord[];
