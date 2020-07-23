<template>
  <v-container>
    <v-row>
      <v-col cols="1">
        <v-btn color="primary" @click="addMenu" style="justify-content: flex-start">New Menu</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="menus" :items-per-page="15" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn small color="primary" @click="editItem(item)">Edit</v-btn>
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
                        <v-text-field v-model="selectedMenu.name" label="Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field type="number" v-model="selectedMenu.price" label="Price"></v-text-field>
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
    ...mapGetters(["isMerchantAuthenticated", "authenticatedMerchant"])
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
          value: "name"
        },
        { text: "Price", value: "price" },
        { text: "Actions", value: "actions" }
      ],
      menus: [],
      isEdit: false,
      isCreate: false,
      isDelete: false,
      editedMenu: [],
      selectedRestaurant: {},
      selectedMenu: {
        name: null,
        price: null
      },
      selectedMenuOriginal: null
    };
  },

  methods: {
    async initialize() {
      try {
        store.dispatch("setLoading", {
          message: "Loading...",
          isShown: true
        });
        let response = await this.$http.get(
          `/api/menu/${this.authenticatedMerchant.restaurantOwner}`
        );

        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false
        });

        this.menus = response.data.data;
      } catch (err) {
        store.dispatch("setLoading", {
          message: "Approving...",
          isShown: false
        });
      }
    },
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
    close() {
      this.dialog = false;
      this.isEdit = false;
      this.isCreate = false;
      this.isDelete = false;
    },
    addMenu() {
      this.selectedMenu = {
        name: "",
        price: 0
      };
      this.dialog = true;
      this.isCreate = true;
    },
    editItem(item) {
      this.selectedMenu = {
        name: item.name,
        price: item.price
      };
      this.selectedMenuOriginal = {
        name: item.name,
        price: item.price
      };
      this.isEdit = true;
      this.dialog = true;
    },
    async deleteItem(item) {
      try {
        this.selectedMenu = {
          name: item.name,
          price: item.price
        };
        this.isDelete = true;
        let index = this.menus.includes(this.selectedMenu);
        if (index !== -1) {
          this.editedMenu = this.menus.slice();
          this.editedMenu.splice(index, 1);
        }

        this.setLoading("Loading...", true);

        let response = await this.$http.post(
          `/api/merchant/menu/${this.authenticatedMerchant.restaurantOwner}`,
          {
            menus: this.editedMenu
          }
        );
        this.menus = this.editedMenu;
        this.isDelete = false;
        this.setLoading("", false);
        this.showSnackbar("Success.", "success");
      } catch (err) {
        this.editedMenu = this.menus;
        this.isDelete = false;
        this.setLoading("", false);
        this.showSnackbar("Something went wrong, please try again.", "error");
      }
    },
    async saveMenu(item) {
      try {
        if (this.isEdit) {
          this.editedMenu = this.menus.map(menu => {
            if (
              menu.name === this.selectedMenuOriginal.name &&
              menu.price === this.selectedMenuOriginal.price
            )
              return {
                name: this.selectedMenu.name,
                price: parseFloat(this.selectedMenu.price)
              };
            return menu;
          });
        } else if (this.isCreate) {
          this.editedMenu = this.menus.slice();
          this.editedMenu.push({
            name: this.selectedMenu.name,
            price: parseInt(this.selectedMenu.price)
          });
        } else if (this.isDelete) {
          let index = this.menus.includes(this.selectedMenu);
          if (index !== -1) {
            this.editedMenu = this.menus.slice();
            this.editedMenu.splice(index, 1);
          }
        }

        this.setLoading("Loading...", true);

        let response = await this.$http.post(
          `/api/merchant/menu/${this.authenticatedMerchant.restaurantOwner}`,
          {
            menus: this.editedMenu
          }
        );

        this.menus = this.editedMenu;
        this.isEdit = false;
        this.isCreate = false;
        this.isDelete = false;
        this.setLoading("", false);
        this.showSnackbar("Success.", "success");

        this.dialog = false;
      } catch (err) {
        this.editedMenu = this.menus;
        this.dialog = false;
        this.isEdit = false;
        this.isCreate = false;
        this.isDelete = false;
        this.setLoading("", false);
        this.showSnackbar("Something went wrong, please try again.", "error");
      }
    }
  }
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
