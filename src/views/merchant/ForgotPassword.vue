<template>
  <v-app class="center">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Forgot Password</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="isFormValid" @submit.prevent="onSubmit">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-account"
                  type="text"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!isFormValid" @click="onSubmit">Submit</v-btn>
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
      email: null,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
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
    async onSubmit() {
      if (this.isFormValid)
        try {
          this.setLoading("Sending...", true);

          let response = await this.$http.post("/auth/forgot-password", {
            email: this.email
          });

          this.setLoading("Sending...", false);
          this.showSnackbar("Email sent.", "success");
        } catch (err) {
          this.setLoading("Login...", false);
          this.showSnackbar("Something went wrong, please try again.", "error");
        }
    }
  }
};
</script>

<style lang="scss" scoped></style>
