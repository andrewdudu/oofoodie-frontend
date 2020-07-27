<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="orders" :items-per-page="15" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="display(item)">mdi-eye</v-icon>
            <v-btn small color="primary" @click="cancel(item)">Cancel</v-btn>
            <v-btn small color="error" @click="complete(item)" style="margin-left: 10px">COMPLETE</v-btn>
          </template>

          <template v-slot:top>
            <v-dialog v-model="dialog" max-width="700px">
              <v-card>
                <v-card-title>
                  <span class="headline">Order Detail</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="4" class="left">Username :</v-col>
                      <v-col cols="8" class="right">{{ selectedOrder.username }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="4" class="left">Time :</v-col>
                      <v-col cols="8" class="right">{{ selectedOrder.time }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="4" class="left">Menu :</v-col>
                      <v-col cols="8">
                        <v-row v-for="value in selectedOrder.orderMenu" :key="value.name">
                          <v-col cols="2">{{ value.qty + " " }} x</v-col>
                          <v-col cols="4" class="left">{{ value.name }}</v-col>
                          <v-col cols="6" class="right">{{ formatPrice(value.price) }}</v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store.js";
import { mapGetters } from "vuex";

export default {
  created() {
    this.initialize();
  },

  computed: {
    ...mapGetters(["isMerchantAuthenticated", "authenticatedMerchant"]),
  },

  data() {
    return {
      dialog: false,
      hasNotRequested: true,
      headers: [
        {
          text: "Username",
          align: "start",
          sortable: false,
          value: "username",
        },
        { text: "Menu Count", value: "orderMenu.length" },
        { text: "Time", value: "time" },
        { text: "Actions", value: "actions" },
      ],
      orders: [],
      isEdit: false,
      isCreate: false,
      isDelete: false,
      editedMenu: [],
      selectedRestaurant: {},
      selectedOrder: {},
      selectedMenuOriginal: null,
    };
  },

  methods: {
    async initialize() {
      try {
        store.dispatch("setLoading", {
          message: "Loading...",
          isShown: true,
        });
        let response = await this.$http.get(`/api/merchant/orders`);

        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });

        this.orders = response.data.data;
      } catch (err) {
        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });
      }
    },
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
    display(item) {
      this.selectedOrder = item;
      this.dialog = true;
    },
    async cancel(item) {
      try {
        await this.$http.post(`/api/merchant/orders/${item.id}/cancel`);

        store.dispatch("setSnackbar", {
          message: "Canceled...",
          isShown: true,
          color: "success",
        });

        let index = this.orders.indexOf(item);
        if (index !== -1) {
          this.orders.splice(index, 1);
        }
      } catch (err) {
        store.dispatch("setSnackbar", {
          message: "Something went wrong, please try again.",
          isShown: true,
          color: "error",
        });
      }
    },
    async complete(item) {
      try {
        await this.$http.post(`/api/merchant/orders/${item.id}/complete`);

        store.dispatch("setSnackbar", {
          message: "Canceled...",
          isShown: true,
          color: "success",
        });

        let index = this.orders.indexOf(item);
        if (index !== -1) {
          this.orders.splice(index, 1);
        }
      } catch (err) {
        store.dispatch("setSnackbar", {
          message: "Something went wrong, please try again.",
          isShown: true,
          color: "error",
        });
      }
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
};
</script>

<style lang="scss" scoped>
.right {
  display: flex;
  justify-content: flex-start;
}
.left {
  display: flex;
  justify-content: flex-end;
}
</style>
