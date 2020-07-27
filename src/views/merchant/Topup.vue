<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-text-field v-model="credit" label="Enter Credit Amount" type="number"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-select v-model="paymentMethod" :items="items" label="Payment Method" dense></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-btn type="number" @click="onTopup">Topup</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store.js";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isMerchantAuthenticated", "authenticatedMerchant"]),
  },

  data() {
    return {
      items: ["BNI", "BCA", "Mandiri"],
      paymentMethod: "",
      credit: 0,
    };
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
    async onTopup() {
      try {
        this.setLoading("Loading...", true);

        await this.$http.post(`/api/merchant/credit`, {
          credit: this.credit,
          paymentMethod: this.paymentMethod,
        });

        this.setLoading("", false);
        this.showSnackbar("Waiting payment.", "success");
      } catch (err) {
        this.setLoading("", false);
        this.showSnackbar("Something went wrong, please try again.", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
