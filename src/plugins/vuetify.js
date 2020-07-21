import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      dark: {
        primary: "#007bff",
        secondary: "#333",
        accent: "#37474F",
      },
    },
  },
};

export default new Vuetify(opts);
