import { createApp } from 'vue'
import App from './App.vue'
import 'amfe-flexible'

import Vant from 'vant'
import 'vant/lib/index.css'

import router from './router'
import store from './store'

import { filterTime } from './utils/dayjs'

import './assets/styles/index.less'

const app = createApp(App)

app.use(Vant).use(router).use(store)

app.config.globalProperties.$filters = { filterTime }

app.mount('#app')
