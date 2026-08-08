import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/topic/:id',
    component: () => import('@/pages/topic/reply/index.vue'),
    meta: {
      scrollToTop: true,
    },
  },
] as RouteRecordRaw[];
