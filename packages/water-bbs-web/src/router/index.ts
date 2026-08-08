import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { setupGuard } from './guards';

export const router = createRouter({
  routes,
  history: createWebHistory(),
});


setupGuard(router);
