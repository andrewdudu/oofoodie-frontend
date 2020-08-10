<template>
  <v-data-table :headers="headers" :items="restaurants" :items-per-page="15" class="elevation-1">
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="display(item)">mdi-eye</v-icon>
      <v-btn
        v-if="item.requested !== null"
        small
        color="primary"
        @click="request(item)"
      >Cancel Request</v-btn>
      <v-btn v-if="hasNotRequested" small color="primary" @click="request(item)">Request</v-btn>
    </template>
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Restaurant Detail</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="4" class="left">Name :</v-col>
                <v-col cols="8" class="right">
                  {{
                  selectedRestaurant.name
                  }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Telephone :</v-col>
                <v-col cols="8" class="right">
                  {{
                  selectedRestaurant.telephone
                  }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Address :</v-col>
                <v-col cols="8" class="right">
                  {{
                  selectedRestaurant.address
                  }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Type :</v-col>
                <v-col cols="8" class="right">
                  {{
                  selectedRestaurant.type
                  }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Cuisine :</v-col>
                <v-col cols="8" class="right">
                  {{
                  selectedRestaurant.cuisine
                  }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Image :</v-col>
                <v-col cols="8" class="right">
                  <img :src="`/api/img/${selectedRestaurant.image}`" style="width: 100%" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Open Hour :</v-col>
                <v-col cols="8">
                  <v-row v-for="(value, name) in selectedRestaurant.openHour" :key="name">
                    <v-col cols="4" class="left">
                      {{
                      name.charAt(0).toUpperCase() + name.slice(1)
                      }}
                    </v-col>
                    <v-col cols="8" class="right">
                      {{ convertHour(value.open) }} -
                      {{ convertHour(value.close) }}
                    </v-col>
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
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Telephone", value: "telephone" },
        { text: "Address", value: "address" },
        { text: "Type", value: "type" },
        { text: "Cuisine", value: "cuisine" },
        { text: "Actions", value: "actions" },
      ],
      restaurants: [],
      selectedRestaurant: {},
    };
  },

  methods: {
    async initialize() {
      try {
        store.dispatch("setLoading", {
          message: "Loading...",
          isShown: true,
        });
        let response = await this.$http.get(
          "/api/merchant/restaurant/available"
        );

        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });
        this.restaurants = response.data.data.map((restaurant) => {
          let requested = null;
          if (
            restaurant.merchantUsername === this.authenticatedMerchant.username
          ) {
            this.hasNotRequested = false;
            requested = true;
          }
          return Object.assign({}, restaurant, {
            requested,
          });
        });
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
    convertHour(time) {
      let timeString = time;
      let H = +timeString.substr(0, 2);
      let h = H % 12 || 12;
      let ampm = H < 12 ? "  AM" : "  PM";
      timeString = h + timeString.substr(2, 3) + ampm;
      return timeString;
    },
    async request(item) {
      try {
        this.setLoading("Requesting...", true);

        await this.$http.post(`/api/merchant/restaurant/${item.id}/request`);

        item.requested = item.requested === null ? true : null;
        this.hasNotRequested = !this.hasNotRequested;
        this.setLoading("Login...", false);
        this.showSnackbar("Request success.", "success");
      } catch (err) {
        this.setLoading("", false);
        this.showSnackbar(
          "Something went wrong, please try again later.",
          "error"
        );
      }
    },
    display(item) {
      this.dialog = true;

      this.selectedRestaurant = {
        name: item.name,
        telephone: item.telephone,
        address: item.address,
        type: item.type,
        cuisine: item.cuisine,
        image: item.image,
        openHour: item.openHour,
      };
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
