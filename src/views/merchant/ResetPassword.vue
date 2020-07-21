<template>
  <v-app class="center">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Reset Password</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="isFormValid" @keyup.native.enter="onReset">
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>

                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="Confirm Password"
                  name="confirm-password"
                  prepend-icon="mdi-lock"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!isFormValid" @click="onReset">Reset</v-btn>
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
      isFormValid: false,
      confirmPasswordRules: [
        v => !!v || "Confirm Password is required",
        v => v === this.password || "Password must be the same"
      ],
      passwordRules: [v => !!v || "Password is required"],
      confirmPassword: "",
      password: ""
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
    async onReset() {
      if (this.isFormValid)
        try {
          this.setLoading("Loading...", true);

          await this.$http.post("/auth/reset-password", {
            token: this.$route.query.token,
            password: this.password
          });

          this.setLoading("Loading...", false);
          this.showSnackbar("Password Changed.", "success");
          router.push("/merchant");
        } catch (err) {
          this.setLoading("Loading...", false);
          this.showSnackbar("Something went wrong.", "error");
        }
    }
  }
};
</script>

<style lang="scss" scoped></style>
