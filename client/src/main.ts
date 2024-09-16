import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

const app = createApp(App)

app.use(createPinia()).use(router).use(Antd)

app.mount('#app')
