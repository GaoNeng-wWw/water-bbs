import { createApp } from 'vue';
import App from './App.vue';
import { vAuthed, vGovernanceMember } from './directive';
import './assets/style.css';
import { router } from '@/router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { setupClient } from './client';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(VueQueryPlugin);
app.use(router);
app.use(pinia);
app.directive('authed', vAuthed);
app.directive('governance-member', vGovernanceMember);

setupClient();

setTimeout(() => {
  app.mount('#app');
}, 0);
