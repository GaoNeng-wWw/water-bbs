import { createApp } from 'vue';
import App from './App.vue';
import { vAuthed } from './directive';
import './assets/style.css';
import { router } from '@/router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(pinia);
app.directive('authed', vAuthed);
app.mount('#app');
