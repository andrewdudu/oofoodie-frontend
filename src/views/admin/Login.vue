<template>
  <v-app class="center">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login for Admin</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="isLoginFormValid" @keyup.native.enter="onLoginClicked">
                <v-text-field
                  v-model="username"
                  :rules="usernameRules"
                  label="Username"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!isLoginFormValid" @click="onLoginClicked">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import store from "@/store.js";
import router from "@/router.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isLoginFormValid: false,
      username: null,
      password: null,
      usernameRules: [v => !!v || "Username is required"],
      passwordRules: [v => !!v || "Password is required"]
    };
  },

  created() {
    this.initialize();
  },

  computed: {
    ...mapGetters(["isAdminAuthenticated", "authenticatedAdmin"])
  },

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
    initialize() {
      if (
        this.isAdminAuthenticated &&
        this.authenticatedAdmin.roles.includes("ROLE_ADMIN")
      ) {
        router.push("/admin/dashboard/restaurant");
      }
    },
    async onLoginClicked() {
      if (this.isLoginFormValid)
        try {
          this.setLoading("Logging in...", true);

          let response = await this.$http.post("/auth/login/admin", {
            username: this.username,
            password: this.password
          });

          this.setLoading("Login...", false);
          this.showSnackbar("Login Success.", "success");
          store.dispatch("setAdminAuthenticated", true);
          store.dispatch("setAuthenticatedAdmin", response.data.user);
          router.push("/admin/dashboard/restaurant");
        } catch (err) {
          this.setLoading("Login...", false);
          this.showSnackbar("Incorrect username or password.", "error");
        }
    }
  }
};
</script>

<style lang="scss" scoped></style>
