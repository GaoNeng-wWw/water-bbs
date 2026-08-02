import type { RouteRecord } from 'vue-router';

export default [
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
  },
] as unknown as RouteRecord[];
