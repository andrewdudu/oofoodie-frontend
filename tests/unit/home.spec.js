import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import axios from "@/axios.js";
import VueAxios from "vue-axios";
import Vue from "vue";
import Vuex from "vuex";
import Home from "@/views/user/Home.vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(Vuex);

const $router = {
  push: jest.fn(),
};

const $http = {
  get: jest.fn(),
};

describe("Home.vue", () => {
  const expectedData = {
    route: {
      path: "explore",
      query: {
        q: "",
      },
    },
  };

  let wrapper, getters, actions, store, vuetify;

  const data = {
    search: "",
    popularRestaurants: [],
    vouchers: [],
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    let getters = {};
    let actions = {};

    store = new Vuex.Store({ getters, actions });
    wrapper = shallowMount(Home, {
      data() {
        return {
          ...data,
        };
      },
      mocks: {
        $router,
        $http,
      },
      store,
      localVue,
      vuetify,
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  // it("Check onSubmitSearch called", () => {
  //   wrapper.vm.onSubmitSearch();

  //   expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
  // });

  it("Check initialize called", async () => {
    wrapper.vm.initialize();
    await flushPromises();

    expect(wrapper.vm.$http.get).toHaveBeenCalledTimes(4);
  });
});
