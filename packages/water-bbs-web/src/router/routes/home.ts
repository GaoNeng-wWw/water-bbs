import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/:id?',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      scrollToTop: true,
    },
  },
] as RouteRecordRaw[];
