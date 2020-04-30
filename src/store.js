import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: {
      message: "Loading...",
      isShown: false,
    },
    snackbar: null,
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    setSnackbar(state, value) {
      state.snackbar = value;
    },
  },
  actions: {
    setLoading({ commit }, loading) {
      commit("setLoading", loading);
    },
    setSnackbar({ commit }, snackbar) {
      commit("setSnackbar", snackbar);
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    snackbar(state) {
      return state.snackbar;
    },
  },
});
