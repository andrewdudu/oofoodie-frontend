<template>
  <v-form class="form" v-model="isFormValid">
    <v-text-field v-model="name" :rules="nameRules" label="Restaurant Name" required></v-text-field>
    <v-text-field v-model="address" :rules="addressRules" label="Address" required></v-text-field>
    <v-select
      v-model="model"
      :items="restoType"
      :append-icon="mdi - plus"
      @change="onRestoTypeChange"
      label="Restaurant Type"
    >
      <template v-if="selectSlot" v-slot:selection="{ item, index }">
        <v-chip v-if="index === 0">
          <span>{{ item }}</span>
        </v-chip>
        <span v-if="index === 1" class="grey--text caption">(+{{ model.length - 1 }} others)</span>
      </template>
    </v-select>
    <v-text-field v-model="cuisine" :rules="cuisineRules" label="Cuisine" required></v-text-field>
    <v-text-field v-model="telephone" :rules="telephoneRules" label="Telephone" required></v-text-field>
    <v-file-input accept="image/*" label="Image" :rules="imageRules" @change="onImageChange"></v-file-input>

    <v-dialog v-model="dialog" persistent max-width="600px" eager>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Set Open Hour</v-btn>
        <v-btn class="mr-4 submit-btn" @click="onSubmit" :disabled="!isFormValid">submit</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Open Hour</span>
        </v-card-title>
        <v-card-text>
          <v-checkbox
            v-model="checkbox"
            :error-messages="errors"
            value="1"
            label="Same Hour Everyday"
            type="checkbox"
            required
          ></v-checkbox>
          <div v-if="checkbox">
            <v-row>
              <v-col class="d-flex" cols="6">
                <v-menu
                  ref="menu"
                  v-model="menuOpenHour"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="openHour"
                      label="Open Hour"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                      :rules="hourRules"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuOpenHour"
                    v-model="openHour"
                    full-width
                    @click:minute="$refs.menu.save(openHour)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="6">
                <v-menu
                  ref="menu"
                  v-model="menuCloseHour"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="closeHour"
                      label="Close Hour"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                      :rules="hourRules"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuCloseHour"
                    v-model="closeHour"
                    full-width
                    @click:minute="$refs.menu.save(closeHour)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
          <div v-if="!checkbox">
            <v-row v-for="day in days" :key="day">
              <v-col
                class="d-flex"
                cols="2"
                style="align-items: center; justify-content: center;"
                sm="6"
              >
                <span>{{ day.slice(0, 3) }}</span>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-menu
                  ref="menu"
                  v-model="dayHour[day.toLowerCase()].openMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dayHour[day.toLowerCase()].openHour"
                      label="Open Hour"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                      :rules="eachHourRules"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="dayHour[day.toLowerCase()].openMenu"
                    v-model="dayHour[day.toLowerCase()].openHour"
                    full-width
                    @click:minute="
                      $refs.menu.save(dayHour[day.toLowerCase()].openHour)
                    "
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col class="d-flex" cols="5">
                <v-menu
                  ref="menu"
                  v-model="dayHour[day.toLowerCase()].closeMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dayHour[day.toLowerCase()].closeHour"
                      label="Close Hour"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                      :rules="eachHourRules"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="dayHour[day.toLowerCase()].closeMenu"
                    v-model="dayHour[day.toLowerCase()].closeHour"
                    full-width
                    @click:minute="
                      $refs.menu.save(dayHour[day.toLowerCase()].closeHour)
                    "
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import store from "@/store.js";
import _ from "lodash";

export default {
  data() {
    return {
      isFormValid: false,
      valid: true,
      name: "",
      address: "",
      cuisine: "",
      type: "",
      telephone: "",
      image: "",
      imageSize: 0,
      nameRules: [v => !!v || "Name is required"],
      addressRules: [v => !!v || "Address is required"],
      cuisineRules: [v => !!v || "Cuisine is required"],
      telephoneRules: [v => !!v || "Telephone is required"],
      imageRules: [
        v => !!v || "Image is required",
        v => this.imageSize < 2097152
      ],
      eachHourRules: [v => this.checkbox || !!v || "Hour is required"],
      hourRules: [v => !this.checkbox || !!v || "Hour is required"],
      select: null,
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      restoType: ["Casual Dining", "Dining"],
      dayHour: {
        sunday: {
          openHour: null,
          closeHour: null,
          openMenu: false,
          closeMenu: false,
          menuOpen: "sundayOpen",
          menuClose: "sundayClose"
        },
        monday: {
          openHour: null,
          closeHour: null,
          openMenu: false,
          closeMenu: false,
          menuOpen: "mondayOpen",
          menuClose: "mondayClose"
        },
        tuesday: {
          openHour: null,
          closeHour: null,
          openMenu: false,
          closeMenu: false,
          menuOpen: "tuesdayOpen",
          menuClose: "tuesdayClose"
        },
        wednesday: {
          openHour: null,
          closeHour: null,
          openMenu: false,
          closeMenu: false,
          menuOpen: "wednesdayOpen",
          menuClose: "wednesdayClose"
        },
        thursday: {
          openHour: null,
          closeHour: null,
          openMenu: false,
          closeMenu: false,
          menuOpen: "thursdayOpen",
          menuClose: "thursdayClose"
        },
        friday: {
          openHour: null,
          closeHour: null,
          openMenu: false,
          closeMenu: false,
          menuOpen: "fridayOpen",
          menuClose: "fridayClose"
        },
        saturday: {
          openHour: null,
          closeHour: null,
          openMenu: false,
          closeMenu: false,
          menuOpen: "saturdayOpen",
          menuClose: "saturdayClose"
        }
      },
      openHour: null,
      closeHour: null,
      menuOpenHour: false,
      menuCloseHour: false,
      dialog: false,
      checkbox: false
    };
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
    onImageChange(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      this.imageSize = file.size;
      reader.onload = () => {
        this.image = reader.result.substr(reader.result.indexOf(",") + 1);
      };
    },
    async onSubmit() {
      try {
        this.setLoading("Loading...", true);

        let lat = this.$route.query.lat;
        let lon = this.$route.query.lng;
        let openHour = _.cloneDeep(this.dayHour);

        Object.keys(openHour).map((key, index) => {
          let newObj = {
            open: this.checkbox ? this.openHour : openHour[key].openHour,
            close: this.checkbox ? this.closeHour : openHour[key].closeHour
          };
          openHour[key] = newObj;
        });

        let response = await this.$http.post("/api/restaurant", {
          name: this.name,
          telephone: this.telephone,
          location: {
            lat,
            lon
          },
          address: this.address,
          type: this.type,
          cuisine: this.cuisine,
          image: this.image,
          openHour
        });

        this.setLoading("Loading...", false);
        this.showSnackbar("Waiting for approval", "success");
      } catch (err) {
        this.setLoading("Loading...", false);
        this.showSnackbar("Something went wrong", "error");
      }
    },
    onRestoTypeChange(val) {
      this.type = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  padding: 20px 40px 20px 40px;
}

.dash {
  align-items: center;
  font-weight: bold;
}

[class^="col-"],
[class*=" col-"] {
  padding-top: 0;
  padding-bottom: 0;
}

.submit-btn {
  margin: 20px;
}
</style>
