import { createApp } from 'vue';
import App from './App.vue';
import { vAuthed, vGovernanceMember } from './directive';
import './assets/style.css';
import { router } from '@/router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { setupClient } from './client';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createI18n } from 'vue-i18n';
import { setupGuard } from './router/guards';

const i18n = createI18n({
  availableLocales: ['en-us', 'zh-cn'],
  locale: 'en-us',
});

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
app.use(pinia);
app.use(router);
app.use(i18n);
app.directive('authed', vAuthed);
app.directive('governance-member', vGovernanceMember);

setupClient();
setupGuard(router);

setTimeout(() => {
  app.mount('#app');
}, 0);
