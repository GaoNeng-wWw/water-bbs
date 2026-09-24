import { createApp } from 'vue';
import App from './App.vue';
import { vAuthed, vGovernanceMember } from './directive';
import './assets/style.css';
import { router } from '@/router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { setupClient } from './client';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);
const pinia = createPinia();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // 可选：自定义重试延迟
    },
  },
});
pinia.use(piniaPluginPersistedstate);
app.use(VueQueryPlugin, { queryClient });
app.use(router);
app.use(pinia);
app.directive('authed', vAuthed);
app.directive('governance-member', vGovernanceMember);

setupClient();

setTimeout(() => {
  app.mount('#app');
}, 0);
