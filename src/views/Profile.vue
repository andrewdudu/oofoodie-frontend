<template>
  <div>
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
          <span v-if="isAuthenticated" class="restaurant-description">32 Restaurant visits</span>
        </v-row>
      </v-col>
    </v-row>

    <v-tabs
      v-model="tab"
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
        <v-timeline align-top dense>
          <v-timeline-item v-for="n in tempTimeline" :key="n" large color="#41e296">
            <template v-slot:icon>
              <v-icon color="#2A6B49">star</v-icon>
            </template>
            <template v-slot:opposite>
              <span>{{ n.resto_name }}</span>
            </template>
            <v-card class="elevation-2">
              <v-card-title class="headline">{{ n.resto_name }}</v-card-title>
              <v-card-text>Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.</v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-tab-item>
      <v-tab-item value="orders">orders</v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import router from "@/router.js";
import store from "@/store.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      reviewCount: 0,
      isLoginFormValid: false,
      isSignupFormValid: false,
      rating: 3,
      usernameRules: [v => !!v || "Username is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      confirmPasswordRules: [
        v => !!v || "Confirm Password is required",
        v => v === this.password || "Password must be the same"
      ],
      nameRules: [v => !!v || "Name is required"],
      passwordRules: [v => !!v || "Password is required"],
      username: "",
      usernameLogin: "",
      passwordLogin: "",
      email: "",
      name: "",
      confirmPassword: "",
      password: "",
      averageRating: 0,
      tempTimeline: [
        {
          type: "rating",
          resto_name: "Resto Name",
          star: 4,
          comment: "Comment blabla",
          time: "23:00 AM",
          likes: 23,
          review: {
            user_id: "123-123",
            resto_id: "123-123",
            star: 4,
            comment: "Comments",
            time: "23:00 AM"
          }
        },
        {
          type: "restaurant",
          resto_name: "Resto Name",
          star: 4,
          comment: "Comment blabla",
          time: "23:00 AM",
          likes: 23,
          review: {
            user_id: "123-123",
            resto_id: "123-123",
            star: 4,
            comment: "Comments",
            time: "23:00 AM"
          }
        },
        {
          type: "rating",
          resto_name: "Resto Name",
          star: 4,
          comment: "Comment blabla",
          time: "23:00 AM",
          likes: 23,
          review: {
            user_id: "123-123",
            resto_id: "123-123",
            star: 4,
            comment: "Comments",
            time: "23:00 AM"
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "authenticatedUser"]),
    User() {
      if (this.authenticatedUser !== null) {
        let avgStar = 0;
        if (this.authenticatedUser.timelines !== null) {
          this.authenticatedUser.timelines.forEach(timeline => {
            if (timeline.type === "review") {
              avgStar += timeline.star;
              this.reviewCount++;
            }
          });
          this.averageRating = (
            avgStar / this.authenticatedUser.timelines.length
          ).toFixed(2);
        }
      }
      console.log(this.authenticatedUser);
      return this.authenticatedUser;
    }
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
    async onLoginClicked() {
      try {
        this.setLoading("Login...", true);

        let response = await this.$http.post("/auth/login", {
          username: this.usernameLogin,
          password: this.passwordLogin
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
    async onSignupClicked() {
      try {
        this.setLoading("Signing up...", true);

        await this.$http.post("/auth/signup", {
          username: this.username,
          name: this.name,
          password: this.password,
          email: this.email
        });

        this.setLoading("Signing up...", false);
        this.showSnackbar("Signup Success.", "success");
      } catch (err) {
        this.setLoading("Signing up...", false);
        this.showSnackbar("Please fill the form correctly.", "error");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
