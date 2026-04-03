import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/style.css';
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useAuthStore } from './stores/auth'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Vue3Toastify);

const auth = useAuthStore()

// ✅ Await initialization before mounting app
await auth.initialize()

app.mount('#app');