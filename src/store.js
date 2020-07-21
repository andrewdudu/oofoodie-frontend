import Vue from "vue";
import Vuex from "vuex";
import axios from "./axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: {
      message: "Loading...",
      isShown: false,
    },
    snackbar: null,
    isAuthenticated: null,
    isAdminAuthenticated: null,
    isMerchantAuthenticated: null,
    authenticatedUser: null,
    authenticatedAdmin: null,
    authenticatedMerchant: null,
    role: null,
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    setSnackbar(state, value) {
      state.snackbar = value;
    },
    setRole(state, value) {
      state.role = value;
    },
    setAuthenticated(state, value) {
      state.isAuthenticated = value;
    },
    setAdminAuthenticated(state, value) {
      state.isAdminAuthenticated = value;
    },
    setMerchantAuthenticated(state, value) {
      state.isMerchantAuthenticated = value;
    },
    setAuthenticatedUser(state, value) {
      state.authenticatedUser = value;
    },
    setAuthenticatedAdmin(state, value) {
      state.authenticatedAdmin = value;
    },
    setAuthenticatedMerchant(state, value) {
      state.authenticatedMerchant = value;
    },
  },
  actions: {
    setLoading({ commit }, loading) {
      commit("setLoading", loading);
    },
    setSnackbar({ commit }, snackbar) {
      commit("setSnackbar", snackbar);
    },
    setRole({ commit }, role) {
      commit("setRole", role);
    },
    setAuthenticated({ commit }, isAuthenticated) {
      commit("setAuthenticated", isAuthenticated);
    },
    setAdminAuthenticated({ commit }, isAdminAuthenticated) {
      commit("setAdminAuthenticated", isAdminAuthenticated);
    },
    setMerchantAuthenticated({ commit }, isMerchantAuthenticated) {
      commit("setMerchantAuthenticated", isMerchantAuthenticated);
    },
    setAuthenticatedUser({ commit }, user) {
      commit("setAuthenticatedUser", user);
    },
    setAuthenticatedAdmin({ commit }, admin) {
      commit("setAuthenticatedAdmin", admin);
    },
    setAuthenticatedMerchant({ commit }, merchant) {
      commit("setAuthenticatedMerchant", merchant);
    },
    getAuthenticated({ commit }) {
      return axios
        .post("/auth/refresh")
        .then((response) => {
          if (response.data.user.roles.includes("ROLE_USER")) {
            commit("setAuthenticated", true);
            commit("setAuthenticatedUser", response.data.user);
          } else if (response.data.user.roles.includes("ROLE_MERCHANT")) {
            commit("setMerchantAuthenticated", true);
            commit("setAuthenticatedMerchant", response.data.user);
          } else if (response.data.user.roles.includes("ROLE_ADMIN")) {
            commit("setAdminAuthenticated", true);
            commit("setAuthenticatedAdmin", response.data.user);
          }
        })
        .catch(() => {
          commit("setAuthenticated", false);
          commit("setAuthenticatedUser", null);
        });
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    snackbar(state) {
      return state.snackbar;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    authenticatedUser(state) {
      return state.authenticatedUser;
    },
    isAdminAuthenticated(state) {
      return state.isAdminAuthenticated;
    },
    isMerchantAuthenticated(state) {
      return state.isMerchantAuthenticated;
    },
    authenticatedMerchant(state) {
      return state.authenticatedMerchant;
    },
    authenticatedAdmin(state) {
      return state.authenticatedAdmin;
    },
  },
});
