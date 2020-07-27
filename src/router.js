import Vue from "vue";
import store from "@/store.js";
import Router from "vue-router";

Vue.use(Router);

// USER PAGE
const MainPage = () => import("@/views/user/Home.vue");
const NearbyPage = () => import("@/views/user/Nearby.vue");
const ProfilePage = () => import("@/views/user/Profile.vue");
const ExplorePage = () => import("@/views/user/Explore.vue");
const ForgotPasswordPage = () => import("@/views/user/ForgotPassword.vue");
const ProfileDetailPage = () => import("@/views/user/ProfileDetail.vue");
const ResetPasswordPage = () => import("@/views/user/ResetPassword.vue");
const SuggestMapPage = () =>
  import("@/views/user/SuggestRestaurant/SuggestMap.vue");
const SuggestFormPage = () =>
  import("@/views/user/SuggestRestaurant/SuggestForm.vue");
const RestaurantDetailPage = () => import("@/views/user/Restaurant/Main.vue");

// ADMIN PAGE
const AdminLoginPage = () => import("@/views/admin/Login.vue");
const AdminDashboardPage = () => import("@/views/admin/Index.vue");
const AdminRestaurantPage = () => import("@/views/admin/Restaurant.vue");
const MerchantRequestPage = () => import("@/views/admin/MerchantRequest.vue");

// MERCHANT PAGE
const MerchantLoginPage = () => import("@/views/merchant/Login.vue");
const MerchantSignupPage = () => import("@/views/merchant/Signup.vue");
const MerchantDashboardPage = () => import("@/views/merchant/Index.vue");
const MerchantForgotPasswordPage = () =>
  import("@/views/merchant/ForgotPassword.vue");
const MerchantResetPasswordPage = () =>
  import("@/views/merchant/ResetPassword.vue");
const MerchantRestaurantRequestPage = () =>
  import("@/views/merchant/Restaurant.vue");
const MerchantMenuPage = () => import("@/views/merchant/Menu.vue");
const MerchantOrdersPage = () => import("@/views/merchant/Orders.vue");
const MerchantTopupPage = () => import("@/views/merchant/Topup.vue");
const MerchantPromotePage = () => import("@/views/merchant/Promote.vue");
const MerchantVoucherPage = () => import("@/views/merchant/Voucher.vue");

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: MainPage,
    },
    {
      path: "/nearby",
      name: "nearby",
      component: NearbyPage,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePage,
    },
    {
      path: "/explore",
      name: "explore",
      component: ExplorePage,
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPasswordPage,
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPasswordPage,
    },
    {
      path: "/suggest",
      name: "suggest",
      component: SuggestMapPage,
    },
    {
      path: "/suggest/form",
      name: "suggest-form",
      component: SuggestFormPage,
    },
    {
      path: "/restaurant/:id",
      name: "restaurant-detail",
      component: RestaurantDetailPage,
    },
    {
      path: "/profile/:username",
      name: "profile-detail",
      component: ProfileDetailPage,
    },
    {
      path: "/admin",
      name: "admin-login",
      component: AdminLoginPage,
    },
    {
      path: "/merchant",
      name: "merchant-login",
      component: MerchantLoginPage,
    },
    {
      path: "/merchant/signup",
      name: "merchant-signup",
      component: MerchantSignupPage,
    },
    {
      path: "/merchant/forgot-password",
      name: "merchant-forgot-password",
      component: MerchantForgotPasswordPage,
    },
    {
      path: "/merchant/reset-password",
      name: "merchant-reset-password",
      component: MerchantResetPasswordPage,
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: AdminDashboardPage,
      beforeEnter: (to, from, next) => {
        if (
          store.state.authenticatedAdmin !== null &&
          store.state.authenticatedAdmin.roles.includes("ROLE_ADMIN")
        )
          next();
        else next("/admin");
      },
      children: [
        { path: "restaurant", component: AdminRestaurantPage },
        { path: "merchant", component: MerchantRequestPage },
      ],
    },
    {
      path: "/merchant/dashboard",
      name: "merchant-dashboard",
      component: MerchantDashboardPage,
      beforeEnter: (to, from, next) => {
        if (
          store.state.authenticatedMerchant !== null &&
          store.state.authenticatedMerchant.roles.includes("ROLE_MERCHANT")
        )
          next();
        else next("/merchant");
      },
      children: [
        { path: "restaurant", component: MerchantRestaurantRequestPage },
        { path: "menu", component: MerchantMenuPage },
        { path: "orders", component: MerchantOrdersPage },
        { path: "topup", component: MerchantTopupPage },
        { path: "promote", component: MerchantPromotePage },
        { path: "voucher", component: MerchantVoucherPage },
      ],
    },
  ],
});
