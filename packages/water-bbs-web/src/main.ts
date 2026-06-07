import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './assets/css/style.css';
import 'vue-advanced-cropper/dist/style.css';
import 'virtual:uno.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { vPermission } from './directive';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
app.directive('permission', vPermission);
