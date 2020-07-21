<template>
  <div>
    <Header />
    <v-form class="form" v-model="isFormValid">
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
      <v-row>
        <div class="my-2">
          <v-btn
            rounded
            color="#41E296"
            :disabled="!isFormValid"
            class="white--text"
            @click="onResetClicked"
          >Reset</v-btn>
        </div>
      </v-row>
    </v-form>
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import store from "@/store";

export default {
  name: "forgot-password",
  components: {
    Header,
    Footer
  },
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
  computed: {
    ...mapGetters(["isAuthenticated"])
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
    async onResetClicked() {
      try {
        this.setLoading("Loading...", true);

        await this.$http.post("/auth/reset-password", {
          token: this.$route.query.token,
          password: this.password
        });

        this.setLoading("Loading...", false);
        this.showSnackbar("Password Changed.", "success");
      } catch (err) {
        this.setLoading("Loading...", false);
        this.showSnackbar("Something went wrong.", "error");
      }
    }
  }
};
</script>

<style lang="scss">
$font: "Century Gothic";

.row {
  margin: 0;
}

.profile-description {
  text-align: left;
  font-weight: bold;
  font-family: $font;
  padding-top: 25px;
  font-size: 17px;
}

.review-description {
  font-size: 12px;
}

.restaurant-description {
  font-size: 15px;
}

.forgot-password-btn {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.form {
  padding: 20px 40px 20px 40px;
}
</style>
