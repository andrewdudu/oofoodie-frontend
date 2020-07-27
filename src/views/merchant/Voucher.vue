<template>
  <v-container>
    <v-row>
      <v-col cols="1">
        <v-btn color="primary" @click="addVoucher" style="justify-content: flex-start">New Menu</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="menus" :items-per-page="15" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn small color="error" @click="deleteItem(item)" style="margin-left: 10px">Delete</v-btn>
          </template>
          <template v-slot:top>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Menu</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="name" :rules="nameRules" label="Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-file-input
                          accept="image/*"
                          label="Image"
                          :rules="imageRules"
                          @change="onImageChange"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Close</v-btn>
                  <v-btn color="blue darken-1" text @click="saveMenu">Save</v-btn>
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
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Actions", value: "actions" },
      ],
      menus: [],
      imageSize: 0,
      editedMenu: [],
      name: "",
      image: "",
      imageRules: [
        (v) => !!v || "Image is required",
        () => this.imageSize < 2097152,
      ],
      nameRules: [(v) => !!v || "Name is required"],
      selectedMenu: {
        name: null,
        price: null,
      },
    };
  },

  methods: {
    async initialize() {
      try {
        store.dispatch("setLoading", {
          message: "Loading...",
          isShown: true,
        });
        let response = await this.$http.get(`/api/merchant/voucher`);

        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });

        this.menus = response.data.data;
      } catch (err) {
        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false,
        });
      }
    },
    onImageChange(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      this.imageSize = file.size;
      reader.onload = () => {
        this.image = reader.result.substr(reader.result.indexOf(",") + 1);
      };
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
    close() {
      this.dialog = false;
    },
    addVoucher() {
      this.dialog = true;
    },
    async deleteItem(item) {
      try {
        this.setLoading("Loading...", true);

        await this.$http.delete(`/api/merchant/voucher/${item.id}`);

        this.setLoading("", false);
        this.showSnackbar("Success.", "success");
      } catch (err) {
        this.setLoading("", false);
        this.showSnackbar("Something went wrong, please try again.", "error");
      }
    },
    async saveMenu() {
      try {
        this.setLoading("Loading...", true);

        await this.$http.post("/api/merchant/voucher", {
          name: this.name,
          image: this.image,
        });

        this.setLoading("", false);
        this.showSnackbar("Success.", "success");
      } catch (err) {
        this.setLoading("", false);
        this.showSnackbar("Something went wrong, please try again.", "error");
      }
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
