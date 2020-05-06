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
    getAuthenticated({ commit }) {
      axios
        .post("/auth/refresh")
        .then((res) => {
          commit("setAuthenticated", true);
        })
        .catch((err) => {
          commit("setAuthenticated", false);
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
  },
});
