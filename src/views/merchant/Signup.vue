<template>
  <v-app class="center">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login for Merchant</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form class="form" v-model="isSignupFormValid">
                <v-row>
                  <v-text-field v-model="username" :rules="usernameRules" label="Username" required></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    v-model="confirmPassword"
                    :rules="confirmPasswordRules"
                    label="Confirm Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!isSignupFormValid" @click="onSignupClicked">Signup</v-btn>
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
      isSignupFormValid: false,
      username: null,
      password: null,
      confirmPassword: null,
      email: null,

      usernameRules: [v => !!v || "Username is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      confirmPasswordRules: [
        v => !!v || "Confirm Password is required",
        v => v === this.password || "Password must be the same"
      ],
      nameRules: [v => !!v || "Name is required"],
      passwordRules: [v => !!v || "Password is required"]
    };
  },

  created() {
    this.initialize();
  },

  computed: {
    ...mapGetters(["isMerchantAuthenticated", "authenticatedMerchant"])
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
        this.isMerchantAuthenticated &&
        this.authenticatedMerchant.roles.includes("ROLE_MERCHANT")
      ) {
        router.push("/merchant/dashboard/restaurant");
      }
    },
    async onSignupClicked() {
      if (this.isSignupFormValid)
        try {
          this.setLoading("Signing up...", true);

          let response = await this.$http.post("/auth/signup/merchant", {
            username: this.username,
            name: this.name,
            password: this.password,
            email: this.email
          });

          this.setLoading("Login...", false);
          this.showSnackbar("Signup Success.", "success");
          router.push("/merchant");
        } catch (err) {
          let message = "Please fill the form correctly.";
          this.setLoading("Signing up...", false);
          if (err.response.status === 400) message = err.response.data.message;
          this.showSnackbar(message, "error");
        }
    }
  }
};
</script>

<style lang="scss" scoped></style>
