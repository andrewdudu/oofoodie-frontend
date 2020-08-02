<template>
  <v-data-table :headers="headers" :items="restaurants" :items-per-page="15" class="elevation-1">
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="display(item)">mdi-eye</v-icon>
      <v-btn small color="error" @click="decline(item)">Decline</v-btn>
      <v-btn small class="margin-left" color="primary" @click="approve(item)">Approve</v-btn>
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
                <v-col cols="8" class="right">{{ selectedRestaurant.name }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Telephone :</v-col>
                <v-col cols="8" class="right">{{ selectedRestaurant.telephone }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Address :</v-col>
                <v-col cols="8" class="right">{{ selectedRestaurant.address }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Type :</v-col>
                <v-col cols="8" class="right">{{ selectedRestaurant.type }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Cuisine :</v-col>
                <v-col cols="8" class="right">{{ selectedRestaurant.cuisine }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Image :</v-col>
                <v-col cols="8" class="right">
                  <img
                    :src="`http://128.199.110.11:8080/api/img/${selectedRestaurant.image}`"
                    style="width: 100%"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="left">Open Hour :</v-col>
                <v-col cols="8">
                  <v-row v-for="(value, name) in selectedRestaurant.openHour" :key="name">
                    <v-col cols="4" class="left">{{ name.charAt(0).toUpperCase() + name.slice(1) }}</v-col>
                    <v-col
                      cols="8"
                      class="right"
                    >{{ convertHour(value.open) }} - {{ convertHour(value.close) }}</v-col>
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

export default {
  created() {
    this.initialize();
  },

  data() {
    return {
      dialog: false,
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
        let response = await this.$http.get("/api/admin/restaurant");

        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });
        this.restaurants = response.data.data;
      } catch (err) {
        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });
      }
    },
    convertHour(time) {
      let timeString = time;
      let H = +timeString.substr(0, 2);
      let h = H % 12 || 12;
      let ampm = H < 12 ? "  AM" : "  PM";
      timeString = h + timeString.substr(2, 3) + ampm;
      return timeString;
    },
    async decline(item) {
      try {
        store.dispatch("setLoading", {
          message: "Loading...",
          isShown: true,
        });
        console.log(item);
        let response = await this.$http.delete(
          `/api/admin/restaurant/${item.id}`
        );

        store.dispatch("setLoading", {
          message: "Loading",
          isShown: false,
        });
        store.dispatch("setSnackbar", {
          message: "Declined.",
          isShown: true,
          color: "success",
        });

        this.removeApprovedRestaurant(item);
      } catch (err) {
        store.dispatch("setLoading", {
          message: "",
          isShown: false,
        });
        store.dispatch("setSnackbar", {
          message: "Something went wrong, try again later.",
          isShown: true,
          color: "error",
        });
      }
    },
    async approve(item) {
      try {
        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: true,
        });
        let response = await this.$http.post(
          `/api/admin/restaurant/${item.id}`
        );

        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });
        store.dispatch("setSnackbar", {
          message: "Approved.",
          isShown: true,
          color: "success",
        });

        this.removeApprovedRestaurant(item);
      } catch (err) {
        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });
        store.dispatch("setSnackbar", {
          message: "Something went wrong, try again later.",
          isShown: true,
          color: "error",
        });
      }
    },
    removeApprovedRestaurant(item) {
      let index = this.restaurants.indexOf(item);
      if (index > -1) {
        this.restaurants.splice(index, 1);
      }
    },
    display(item) {
      console.log(item);
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

.margin-left {
  margin-left: 10px;
}
</style>