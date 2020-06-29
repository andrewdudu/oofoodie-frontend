import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/nearby",
      name: "nearby",
      component: () => import("./views/Nearby.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Profile.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("./views/ForgotPassword.vue"),
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("./views/ResetPassword.vue"),
    },
    {
      path: "/suggest",
      component: () => import("./views/SuggestRestaurant/SuggestMap.vue"),
    },
    {
      path: "/suggest/form",
      component: () => import("./views/SuggestRestaurant/SuggestForm.vue"),
    },
    {
      path: "/restaurant/:id",
      component: () => import("./views/Restaurant/Main.vue"),
    },
  ],
});
