import { createApp } from "vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistence from "pinia-plugin-persistedstate";
import App from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersistence);
app.use(ElementPlus);
app.use(router);
app.use(pinia);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
