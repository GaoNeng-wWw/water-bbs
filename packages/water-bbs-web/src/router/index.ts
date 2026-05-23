import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';
import wipGuard from './wip.guard';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

wipGuard(router);
