<template>
  <div id="app" class="main">
    <Header v-if="authenticatedUser === null" />
    <Header v-if="authenticatedUser !== null" btn="Logout" @onBtnClicked="onLogout" />
    <v-dialog v-model="orderDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Menu</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-for="menu in selectedMenu" :key="menu">
              <v-col cols="2">{{ menu.qty }}x</v-col>
              <v-col cols="6">{{ menu.name }}</v-col>
              <v-col cols="4">Rp {{ formatPrice(menu.price) }}</v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-col cols="8">Total Price :</v-col>
              <v-col cols="4">Rp {{ formatPrice(selectedTotalPrice) }}</v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="orderDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="splitBillDialog = true">Split Bill</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="splitBillDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Split Bill</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="8">Total Price :</v-col>
              <v-col cols="4">Rp {{ formatPrice(selectedTotalPrice) }}</v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-form v-model="isSplitBillValid">
                <v-text-field v-model="splitBillEmail" :rules="emailRules" label="Email" required></v-text-field>
              </v-form>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="splitBillDialog = false">Close</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onSplitBillSubmit"
            :disabled="!isSplitBillValid"
          >Split Bill</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="5">
        <v-row>
          <v-col cols="3"></v-col>
          <v-col cols="9">
            <v-avatar color="#616161" size="100">
              <v-icon dark style="font-size: 90px;">mdi-account-circle</v-icon>
            </v-avatar>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="7" class="profile-description">
        <v-row>
          <span v-if="isAuthenticated">{{ User.name }}</span>
        </v-row>
        <v-row>
          <span
            v-if="isAuthenticated"
            class="review-description"
          >{{ reviewCount }} Review(s) - {{ averageRating }} avg rating</span>
        </v-row>
        <v-row>
          <v-rating
            v-if="isAuthenticated"
            class="rating-star"
            v-model="averageRating"
            color="green"
            background-color="green"
            readonly
            dense
          ></v-rating>
        </v-row>
        <v-row>
          <span v-if="isAuthenticated" class="restaurant-description">{{ User.username }}</span>
        </v-row>
      </v-col>
    </v-row>

    <v-tabs
      class="elevation-2"
      centered
      grow
      color="#616161"
      style="box-shadow: none !important;
  -webkit-box-shadow: none !important;"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-if="!isAuthenticated" href="#signin">Signin</v-tab>
      <v-tab v-if="!isAuthenticated" href="#signup">Signup</v-tab>
      <v-tab v-if="isAuthenticated" href="#timeline">Timeline</v-tab>
      <v-tab v-if="isAuthenticated" href="#orders">Orders</v-tab>

      <v-tab-item value="signin">
        <v-form class="form" v-model="isLoginFormValid">
          <v-row>
            <v-text-field v-model="usernameLogin" :rules="usernameRules" label="Username" required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="passwordLogin"
              :rules="passwordRules"
              label="Password"
              type="password"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <div class="my-2">
              <v-btn
                rounded
                color="#41E296"
                :disabled="!isLoginFormValid"
                class="white--text"
                @click="onLoginClicked"
              >Login</v-btn>
            </div>
            <div class="my-2 forgot-password-btn">
              <v-btn class="forgot-password-text" to="/forgot-password" text small>Forgot Password</v-btn>
            </div>
          </v-row>
        </v-form>
      </v-tab-item>
      <v-tab-item value="signup">
        <v-form class="form" v-model="isSignupFormValid">
          <v-row>
            <v-text-field v-model="username" :rules="usernameRules" label="Username" required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
          </v-row>
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
                class="white--text"
                :disabled="!isSignupFormValid"
                @click="onSignupClicked"
              >Signup</v-btn>
            </div>
          </v-row>
        </v-form>
      </v-tab-item>
      <v-tab-item value="timeline">
        <v-timeline
          v-if="
            authenticatedUser !== null && authenticatedUser.timelines !== null
          "
          align-top
          dense
        >
          <v-timeline-item v-for="n in authenticatedUser.timelines" :key="n" large color="#41e296">
            <template v-slot:icon>
              <v-icon color="#2A6B49">star</v-icon>
            </template>
            <template v-slot:opposite>
              <span>{{ n.restaurantName }}</span>
            </template>
            <v-card class="elevation-2">
              <v-card-title class="headline">
                <span class="small-span">Review on</span>
                {{ " " + n.restaurantName }}
              </v-card-title>
              <v-card-text class="card-text">
                <v-row class="star-box">
                  <v-rating
                    class="rating-star"
                    v-model="n.star"
                    color="green"
                    background-color="green"
                    readonly
                    dense
                  ></v-rating>
                  <span class="span-margin-left">{{ n.star }} star</span>
                </v-row>
                {{ n.comment }}
                <div class="btn-icon-div">
                  <v-btn icon color="deep-orange" @click="onLikeBtnClicked(n)">
                    <v-icon
                      size="20"
                      v-bind:color="
                        n.likes.indexOf(authenticatedUser.username) === -1
                          ? '#838383'
                          : '#3AB87B'
                      "
                    >mdi-thumb-up</v-icon>
                  </v-btn>
                  <span class="medium-text">{{ n.likes.length + " " }}Like</span>
                </div>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-tab-item>
      <v-tab-item value="orders">
        <v-row v-for="order in orders" :key="order" @click="onOrderClick(order.orderMenu)">
          <card v-bind:data="order.restaurantResponse" class="margin"></card>
        </v-row>
      </v-tab-item>
    </v-tabs>
    <Footer />
  </div>
</template>

<script>
import router from "@/router.js";
import store from "@/store.js";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Card from "@/components/Card.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    Header,
    Footer,
    Card,
  },

  data() {
    return {
      dialog: false,
      reviewCount: 0,
      isLoginFormValid: false,
      isSignupFormValid: false,
      isSplitBillValid: false,
      orderDialog: false,
      selectedMenu: null,
      selectedTotalPrice: 0,
      splitBillDialog: false,
      profileId: "test",
      orders: [],
      rating: 3,
      usernameRules: [(v) => !!v || "Username is required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Confirm Password is required",
        (v) => v === this.password || "Password must be the same",
      ],
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [(v) => !!v || "Password is required"],
      splitBillEmail: "",
      username: "",
      usernameLogin: "",
      passwordLogin: "",
      email: "",
      name: "",
      confirmPassword: "",
      password: "",
      averageRating: 0,
      timelines: [],
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "authenticatedUser"]),
    User() {
      if (this.authenticatedUser !== null) {
        let avgStar = 0;
        if (this.authenticatedUser.timelines !== null) {
          this.authenticatedUser.timelines.forEach((timeline) => {
            if (timeline.type === "review") {
              avgStar += timeline.star;
            }
          });
          this.reviewCount = this.authenticatedUser.timelines.length;
          this.averageRating = (
            avgStar / this.authenticatedUser.timelines.length
          ).toFixed(2);
        }
      }
      return this.authenticatedUser;
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      let response = await this.$http.get("/api/user/orders");
      this.orders = response.data.data;
      this.orders.forEach((response) => {
        response.restaurantResponse.image =
          "http://128.199.110.11:8080/api/img/" +
          response.restaurantResponse.image;
      });
      this.authenticatedUser.timelines.sort((a, b) =>
        a.number < b.number ? 1 : -1
      );
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
    async onSplitBillSubmit() {
      try {
        await this.$http.post("/api/user/send-email", {
          email: this.splitBillEmail,
          message: "Your Bill : " + this.selectedTotalPrice,
        });

        this.showSnackbar("Bill sent.", "success");
      } catch (err) {
        this.showSnackbar("Something went wrong, please try again.", "error");
      }
    },
    async onLoginClicked() {
      try {
        this.setLoading("Login...", true);

        let response = await this.$http.post("/auth/login", {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });

        this.setLoading("Login...", false);
        this.showSnackbar("Login Successfully.", "success");
        store.dispatch("setAuthenticated", true);
        store.dispatch("setAuthenticatedUser", response.data.user);
        router.push("/");
      } catch (err) {
        this.setLoading("Login...", false);
        this.showSnackbar("Incorrect username or password.", "error");
      }
    },
    onOrderClick(menu) {
      this.orderDialog = true;
      this.selectedMenu = menu;
      this.selectedTotalPrice = 0;
      menu.forEach((menu) => {
        this.selectedTotalPrice += parseFloat(menu.price);
      });
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    async onLikeBtnClicked(timeline) {
      try {
        await this.$http.post(
          `/api/user/timeline/${timeline.id}/like/${this.authenticatedUser.id}`
        );

        this.showSnackbar("Liked.", "success");
        let index = timeline.likes.indexOf(this.authenticatedUser.username);
        if (index !== -1) {
          timeline.likes.splice(index, 1);
        } else {
          timeline.likes.push(this.authenticatedUser.username);
        }
      } catch (err) {
        this.showSnackbar("Something went wrong, please try again.", "success");
      }
    },
    async onSignupClicked() {
      try {
        this.setLoading("Signing up...", true);

        await this.$http.post("/auth/signup", {
          username: this.username,
          name: this.name,
          password: this.password,
          email: this.email,
        });

        this.setLoading("Signing up...", false);
        this.showSnackbar("Signup Success.", "success");
      } catch (err) {
        let message = "Please fill the form correctly.";
        this.setLoading("Signing up...", false);
        if (err.response.status === 400) message = err.response.data.message;
        this.showSnackbar(message, "error");
      }
    },
    async onLogout() {
      try {
        this.setLoading("Loading...", true);
        await this.$http.post("/auth/logout");

        this.setLoading("", false);
        this.showSnackbar("Success.", "success");
        router.go("/profile");
      } catch (err) {
        this.setLoading("", false);
        this.showSnackbar("Something went wrong, please try again.", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$font: "Century Gothic";

#app {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.main {
  margin-bottom: 50px;
}

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

.margin {
  margin: 10px;
}

.headline {
  font-size: 18px !important;

  padding-bottom: 0px !important;
  padding-right: 15px !important;
  padding-left: 15px !important;
  padding-top: 15px !important;
}

.small-span {
  font-size: 15px;
  margin-right: 5px;
}

.card-text {
  text-align: left;
}

.star-box {
  display: flex;
  align-items: center;
  margin-top: -5px;
}

.span-margin-left {
  margin-left: 5px;
}
</style>
