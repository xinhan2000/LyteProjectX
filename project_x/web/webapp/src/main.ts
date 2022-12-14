import { createSSRApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createSSRApp(App);
app.use(router, ElementPlus);

app.mount('#app');
