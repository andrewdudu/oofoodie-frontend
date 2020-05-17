<template>
  <v-form class="form" v-model="isFormValid">
    <v-row>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
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
        >
          Reset
        </v-btn>
      </div>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";

export default {
  name: "forgot-password",
  data() {
    return {
      isFormValid: false,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    setLoading(message, isShown) {
      store.dispatch("setLoading", {
        message,
        isShown,
      });
    },
    showSnackbar(message, color) {
      store.dispatch("setSnackbar", {
        message,
        isShown: true,
        color,
      });
    },
    async onResetClicked() {
      try {
        this.setLoading("Sending...", true);

        await this.$http.post("/auth/forgot-password", {
          email: this.email,
        });

        this.setLoading("Sending...", false);
        this.showSnackbar("Email sent.", "success");
      } catch (err) {
        this.setLoading("Loading...", false);
      }
    },
  },
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
