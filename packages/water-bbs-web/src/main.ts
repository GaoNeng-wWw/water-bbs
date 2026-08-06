import { createApp } from 'vue';
import App from './App.vue';
import { vAuthed } from './directive';
import './assets/style.css';
import { router } from '@/router';

const app = createApp(App);
app.use(router);
app.directive('authed', vAuthed);
app.mount('#app');
