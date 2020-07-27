<template>
  <v-container>
    <v-row>
      <v-radio-group v-model="radioGroup">
        <v-radio v-for="n in promotePackage" :key="n.value" :label="n.label" :value="n"></v-radio>
      </v-radio-group>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-btn type="number" @click="onPromote">Promote</v-btn>
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
      radioGroup: "",
      promotePackage: [
        {
          label: "Promote for 7 days for Rp 30.000",
          price: 30000,
          value: "ONE_WEEK",
        },
        {
          label: "Promote for 14 days for Rp 50.000",
          price: 50000,
          value: "TWO_WEEK",
        },
        {
          label: "Promote for 30 days for Rp 80.000",
          price: 80000,
          value: "ONE_MONTH",
        },
      ],
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
    onPromote() {
      this.setLoading("Loading...", true);

      this.$http
        .post("/api/merchant/restaurant/popular", {
          restoId: this.authenticatedMerchant.restaurantOwner,
          expiredDay: this.radioGroup.value,
        })
        .then(() => {
          this.setLoading("", false);
          this.showSnackbar("Success.", "success");
        })
        .catch((err) => {
          this.setLoading("", false);
          let message = err.response.data.message;
          if (message.includes("restoId")) {
            message = message.match(/\[(.*?)\]/)[1];
          }
          this.showSnackbar(message, "error");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
