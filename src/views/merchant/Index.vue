<template>
  <div id="app">
    <v-app>
      <v-app-bar app dark elevation="0" style="background-color: #e5fbed">
        <v-app-bar-nav-icon color="#204732" @click.stop="sidebarMenu = !sidebarMenu"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn @click="onLogout" color="#3ab87b" class="mr-2">Logout</v-btn>
      </v-app-bar>
      <v-navigation-drawer
        v-model="sidebarMenu"
        app
        floating
        style="background-color: #e5fbed;"
        :permanent="sidebarMenu"
        :mini-variant.sync="mini"
      >
        <v-list dense dark>
          <v-list-item>
            <v-list-item-content>
              <img
                src="@/assets/default.png"
                style="height: 100%; width: 100%; padding-left: 10px; padding-right: 10px;"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list>
          <v-list-item v-for="item in items" :key="item.title" link :to="item.href">
            <v-list-item-icon>
              <v-icon color="#204732">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="color: #204732">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <v-container class="px-4 py-0 fill-height" fluid>
          <v-row class="fill-height">
            <v-col>
              <transition name="fade">
                <router-view></router-view>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
      <v-footer class="py-3">
        <span class="ml-auto overline">ooFoodie &copy;2020</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import store from "@/store.js";
import router from "@/router.js";

export default {
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    items: [
      {
        title: "Pending Restaurant",
        href: "/merchant/dashboard/restaurant",
        icon: "mdi-food"
      },
      {
        title: "Merchant Request",
        href: "/merchant/dashboard/merchant",
        icon: "mdi-account"
      }
    ]
  }),

  methods: {
    setLoading(message, isShown) {
      store.dispatch("setLoading", {
        message,
        isShown
      });
    },
    showSnackbar(message, color) {
      store.dispatch("setSnackbar", {
        message,
        isShown: true,
        color
      });
    },
    async onLogout() {
      try {
        this.setLoading("Logging out...", true);

        let response = await this.$http.post("/auth/logout");

        this.showSnackbar("Logout Success.", "success");
        this.setLoading("Logging out...", false);

        store.dispatch("setAdminAuthenticated", false);
        store.dispatch("setAuthenticatedAdmin", null);

        router.push("/admin");
      } catch (err) {
        this.showSnackbar("Something went wrong, try again later.", "error");
        this.setLoading("Logging out...", false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>