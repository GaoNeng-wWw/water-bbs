import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      scrollToTop: true,
    },
    children: [
      {
        path: 'proposal',
        component: () => import('@/pages/home/proposal/index.vue'),
        meta: {
          scrollToTop: true,
          title: 'Proposal',
        },
      },
      {
        path: '',
        component: () => import('@/pages/home/topic.vue'),
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
  {
    path: '/proposal/:id',
    component: () => import('@/pages/home/proposal/info.vue'),
    meta: {
      scrollToTop: true,
    },
  },
] as RouteRecordRaw[];
