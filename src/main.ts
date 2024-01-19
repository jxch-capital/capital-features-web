import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import 'echarts';
import ECharts from 'vue-echarts';

createApp(App)
    .component('v-echarts', ECharts)
    .use(router)
    .mount('#app')
