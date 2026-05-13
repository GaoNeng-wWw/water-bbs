import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './assets/css/style.css';
import 'virtual:uno.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
