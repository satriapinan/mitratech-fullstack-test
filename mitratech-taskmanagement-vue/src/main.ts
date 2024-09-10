import { createApp } from "vue";
import "./assets/index.css";
import App from "./App.vue";

import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
  timeout: 5000,
  closeOnClick: true,
};

createApp(App).use(Toast, options).mount("#app");
