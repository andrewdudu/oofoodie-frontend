import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./axios";
import VueAxios from "vue-axios";
import vuetify from "@/plugins/vuetify";
import "./registerServiceWorker";

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
