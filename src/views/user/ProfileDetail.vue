<template>
  <div class="main">
    <Header />

    <v-row v-if="user !== null">
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
          <span>{{ user.name }}</span>
        </v-row>
        <v-row>
          <span class="username-description">{{ user.username }}</span>
        </v-row>
        <v-row>
          <span
            class="review-description"
          >{{ reviewCount }} Review(s) - {{ averageRating }} avg rating</span>
        </v-row>
        <v-row>
          <v-rating
            class="rating-star"
            v-model="averageRating"
            color="green"
            background-color="green"
            readonly
            dense
          ></v-rating>
        </v-row>
      </v-col>
    </v-row>

    <v-divider />

    <v-row>
      <v-timeline align-top dense>
        <v-timeline-item v-for="n in user.timelines" :key="n" large color="#41e296">
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
                    v-bind:color="authenticatedUser !== null && n.likes.indexOf(authenticatedUser.username) === -1 ? '#838383' : '#3AB87B'"
                  >mdi-thumb-up</v-icon>
                </v-btn>
                <span class="medium-text">{{ n.likes.length + " " }}Like</span>
              </div>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-row>

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
      profileId: "test",
      rating: 3,
      averageRating: 0,
      reviewCount: 0,
      user: {},
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "authenticatedUser"]),
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      try {
        let response = await this.$http.get(
          `/api/get-user/${this.$route.params.username}`
        );
        this.user = response.data.data;

        let avgStar = 0;
        if (this.user.timelines !== null) {
          this.user.timelines.forEach((timeline) => {
            if (timeline.type === "review") {
              avgStar += timeline.star;
              this.reviewCount++;
            }
          });
          this.averageRating = (avgStar / this.user.timelines.length).toFixed(
            2
          );
          this.user.timelines.sort((a, b) => (a.number < b.number ? 1 : -1));
        }
      } catch (err) {}
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
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    async onLikeBtnClicked(timeline) {
      try {
        await this.$http.post(
          `/api/user/timeline/${timeline.id}/like/${this.user.id}`
        );

        this.showSnackbar("Liked.", "success");
        let index = timeline.likes.indexOf(this.user.username);
        if (index !== -1) {
          timeline.likes.splice(index, 1);
        } else {
          timeline.likes.push(this.user.username);
        }
      } catch (err) {
        this.showSnackbar("Something went wrong, please try again.", "success");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$font: "Century Gothic";

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

.username-description {
  font-size: 12px;
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
