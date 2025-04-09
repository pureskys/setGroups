import {createApp} from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import {createPinia} from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
