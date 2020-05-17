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
    isAuthenticated: false,
    authenticatedUser: null,
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    setSnackbar(state, value) {
      state.snackbar = value;
    },
    setAuthenticated(state, value) {
      state.isAuthenticated = value;
    },
    setAuthenticatedUser(state, value) {
      console.log(value);
      state.authenticatedUser = value;
    },
  },
  actions: {
    setLoading({ commit }, loading) {
      commit("setLoading", loading);
    },
    setSnackbar({ commit }, snackbar) {
      commit("setSnackbar", snackbar);
    },
    setAuthenticated({ commit }, isAuthenticated) {
      commit("setAuthenticated", isAuthenticated);
    },
    setAuthenticatedUser({ commit }, user) {
      commit("setAuthenticatedUser", user);
    },
    getAuthenticated({ commit }) {
      axios
        .post("/auth/refresh")
        .then((response) => {
          commit("setAuthenticated", true);
          commit("setAuthenticatedUser", response.data.user);
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
  },
});
