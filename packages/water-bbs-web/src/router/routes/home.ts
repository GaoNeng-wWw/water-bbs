import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      scrollToTop: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/pages/home/topic.vue'),
        meta: {
          scrollToTop: true,
        },
      },
      {
        path: 'proposal',
        component: () => import('@/pages/home/proposal/index.vue'),
        meta: {
          scrollToTop: true,
        },
      },
      {
        path: ':id?',
        component: () => import('@/pages/home/topic.vue'),
        meta: {
          scrollToTop: true,
        },
      },
    ],
  },
] as RouteRecordRaw[];
