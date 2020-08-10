<template>
  <div id="app" class="margin-bottom">
    <Header v-if="restaurant.menus !== null" btn="Order" @onBtnClicked="onOrder" />
    <Header v-else />
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Review</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-center">
                  <v-rating
                    size="40"
                    v-model="rating"
                    color="#41e296"
                    background-color="#51f2a6"
                    hover
                  ></v-rating>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="comment"
                  name="input-7-1"
                  label="Comment"
                  hint="Leave a comment here."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="onReviewSubmit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="orderDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Menu</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-for="menu in restaurant.menus" :key="menu.name">
              <v-col cols="4">
                <v-checkbox
                  class="no-margin-top"
                  v-model="orderSelected"
                  :label="menu.name"
                  :value="menu"
                ></v-checkbox>
              </v-col>
              <v-col cols="4">
                <span class="v-label theme--light">Rp {{ formatPrice(menu.price) }}</span>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-if="orderSelected.indexOf(menu) !== -1"
                  class="no-margion-top margin-top-minus"
                  v-model="menuWithQty[menu.name].qty"
                  type="number"
                  append-outer-icon="add"
                  @click:append-outer="addQty(menu.name)"
                  prepend-icon="remove"
                  @click:prepend="minusQty(menu.name)"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <span>Time :</span>
              </v-col>
              <v-col cols="8">
                <datetime
                  format="DD-MM-YYYY h:i:s"
                  width="100%"
                  v-model="orderMenuTime"
                  style="position: static"
                ></datetime>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="orderDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="onOrderSubmit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <img v-if="restaurant === null" class="not-found" src="@/assets/restaurant-not-found.svg" />
    <div v-if="restaurant !== null">
      <div class="image">
        <img class="resto-image" :src="`/api/img/${restaurant.image}`" />
      </div>
      <v-container class="padding-top">
        <v-row>
          <v-col cols="10" style="text-align: left">
            <span class="large-text">{{ restaurant.name }}</span>
          </v-col>
          <v-col cols="2">
            <span>
              <star-box v-bind:star="ratingStats.avgStar.toFixed(1)"></star-box>
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" style="text-align: left; margin-top: -7px">
            <span class="small-text">{{ likes }} like(s) - {{ hasBeenThereCount }} been there</span>
          </v-col>
        </v-row>
        <v-row style="margin-top: -7px">
          <v-col cols="8" style="text-align: left">
            <span class="small-text" style="letter-spacing: 1px; opacity: 0.6; font-weight: bold">
              {{ restaurant.type.toUpperCase() }} -
              {{ restaurant.cuisine.toUpperCase() }}
            </span>
          </v-col>
          <v-col class="small-text" cols="4" style="text-align: right">
            <span style="font-weight: bold; opacity: 0.5">
              <v-icon size="17">phone</v-icon>
              {{ restaurant.telephone }}
            </span>
          </v-col>
        </v-row>

        <v-divider class="divider" />

        <v-row>
          <v-col cols="12" style="text-align: left;">
            <span class="large-text address">{{ restaurant.address }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <Map
              style="height: 250px; margin-bottom: 5px;"
              v-bind:markers="restaurantMarker"
              v-bind:centerCoord="centerCoord"
            />
          </v-col>
        </v-row>
        <v-divider class="divider" />
        <v-row style="margin-top: 10px; margin-bottom: 10px">
          <v-col cols="3">
            <div class="btn-icon-div">
              <v-btn icon color="deep-orange" @click="onLikeBtnClicked">
                <v-icon size="30" v-bind:color="isLiked === -1 ? '#838383' : '#3AB87B'">mdi-thumb-up</v-icon>
              </v-btn>
              <span class="medium-text">Like</span>
            </div>
          </v-col>
          <v-col cols="3">
            <div class="btn-icon-div">
              <v-btn icon color="deep-orange" @click="onBeenThereBtnClicked">
                <v-icon
                  size="40"
                  v-bind:color="hasBeenThere === -1 ? '#838383' : '#3AB87B'"
                >mdi-bookmark-check</v-icon>
              </v-btn>
              <span class="medium-text">Been There</span>
            </div>
          </v-col>
          <v-col cols="3">
            <div class="btn-icon-div">
              <v-btn icon color="deep-orange" @click="shareViaWebShare">
                <v-icon size="40" color="#838383">mdi-share</v-icon>
              </v-btn>
              <span class="medium-text">Share</span>
            </div>
          </v-col>
          <v-col cols="3">
            <div class="btn-icon-div">
              <v-btn icon color="deep-orange">
                <v-icon size="40" color="#838383" @click.stop="dialog = true">mdi-star</v-icon>
              </v-btn>
              <span class="medium-text">Review</span>
            </div>
          </v-col>
        </v-row>

        <v-divider class="divider" style="margin-bottom: 10px;" />

        <v-row>
          <span class="small-title">Open Hours :</span>
        </v-row>
        <v-row v-for="(value, key) in restaurant.openHour" :key="key" class="medium-text">
          <v-col cols="1"></v-col>
          <v-col cols="1">
            <v-icon
              v-if="today === key"
              style="margin-right: 10px;"
              size="20"
              class="highlight-text"
            >mdi-food-fork-drink</v-icon>
          </v-col>
          <v-col cols="3" style="text-align: left;">
            <span
              v-bind:class="[today === key ? 'highlight-text' : '']"
            >{{ key[0].toUpperCase() + key.slice(1) }}</span>
          </v-col>
          <v-col cols="6">
            <span v-bind:class="[today === key ? 'highlight-text' : '']">
              {{ convertHour(value.open) }} -
              {{ convertHour(value.close) }}
            </span>
          </v-col>
        </v-row>

        <v-divider class="divider" style="margin-bottom: 10px;" />

        <v-row>
          <span class="small-title">Rate this place :</span>
        </v-row>
        <v-row style="margin-left: 7px;">
          <review-star
            v-bind:star="1"
            style="color: #204732;"
            v-bind:color="'#204732'"
            @click="onStarClicked(1)"
          />
          <review-star
            v-bind:star="2"
            style="color: #2A6B49;"
            v-bind:color="'#2A6B49'"
            @click="onStarClicked(2)"
          />
          <review-star
            v-bind:star="3"
            style="color: #339162;"
            v-bind:color="'#339162'"
            @click="onStarClicked(3)"
          />
          <review-star
            v-bind:star="4"
            style="color: #3AB87B;"
            v-bind:color="'#3AB87B'"
            @click="onStarClicked(4)"
          />
          <review-star
            v-bind:star="5"
            style="color: #41E296;"
            v-bind:color="'#41E296'"
            @click="onStarClicked(5)"
          />
        </v-row>

        <v-divider class="divider" />

        <v-row>
          <span class="small-title">Trustworthy Review</span>
        </v-row>
        <v-row>
          <v-col cols="4" style="display: flex;justify-content: center; padding-right: 0">
            <div class="star-rating">
              <span class="star-rating-text">
                <p style="margin: 0">{{ ratingStats.avgStar.toFixed(1) }}</p>
                <p style="font-size: 13px; margin: 0">{{ likes }} like(s)</p>
              </span>
            </div>
          </v-col>
          <v-col cols="7" class="small-text" :style="cssProps">
            <v-row>
              <v-col cols="3" style="padding: 0">5 Star</v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="8" style="padding: 0px;">
                    <div class="progress-bar">
                      <div class="progress five"></div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <span>{{ ratingStats.five }} %</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">4 Star</v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="8 no-padding">
                    <div class="progress-bar">
                      <div class="progress four"></div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <span>{{ ratingStats.four }} %</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">3 Star</v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="8 no-padding">
                    <div class="progress-bar">
                      <div class="progress three"></div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <span>{{ ratingStats.three }} %</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">2 Star</v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="8 no-padding">
                    <div class="progress-bar">
                      <div class="progress two"></div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <span>{{ ratingStats.two }} %</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">1 Star</v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="8 no-padding">
                    <div class="progress-bar">
                      <div class="progress one"></div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <span>{{ ratingStats.one }} %</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider class="divider" />

        <router-link
          v-for="review in reviews"
          :key="review.reviewId"
          tag="div"
          :to="`/profile/${review.user}`"
        >
          <v-row>
            <v-col cols="8">
              <v-row>
                <v-col cols="12 align-left">
                  <span class="medium-text" style="font-weight: bold;">
                    {{
                    review.user
                    }}
                  </span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col cols="6" style="padding: 0">
                  <span class="small-text">RATED</span>
                </v-col>
                <v-col cols="6" style="padding: 0">
                  <span>
                    <star-box v-bind:star="review.star"></star-box>
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              style="text-align: justify; line-height: normal; padding-left: 15px; padding-right: 15px"
            >
              <span class="small-text">{{ review.comment }}</span>
            </v-col>
          </v-row>

          <v-divider class="divider" />
        </router-link>
      </v-container>
    </div>
    <Footer />
  </div>
</template>

<script>
import StarBox from "@/components/StarBox.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Map from "@/components/Map.vue";
import ReviewStar from "@/components/ReviewStar.vue";
import moment from "moment";
import datetime from "vuejs-datetimepicker";
import _ from "lodash";
import store from "@/store.js";
import { mapGetters } from "vuex";

export default {
  components: {
    StarBox,
    Map,
    ReviewStar,
    Header,
    Footer,
    datetime,
  },
  data() {
    return {
      dialog: false,
      orderDialog: false,
      orderSelected: [],
      isLiked: -1,
      hasBeenThere: -1,
      hasBeenThereCount: 0,
      likes: 0,
      qty: 0,
      restaurant: null,
      restaurantMarker: null,
      centerCoord: [],
      menuWithQty: {},
      rating: 5,
      orderMenuTime: null,
      ratingStats: {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
        avgStar: 0,
      },
      comment: "",
      reviews: [],
      today: moment().isoWeekday(moment().day()).format("dddd").toLowerCase(),
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapGetters(["authenticatedUser"]),
    cssProps() {
      return {
        "--five-star-width": this.ratingStats.five + "%",
        "--four-star-width": this.ratingStats.four + "%",
        "--three-star-width": this.ratingStats.three + "%",
        "--two-star-width": this.ratingStats.two + "%",
        "--one-star-width": this.ratingStats.one + "%",
      };
    },
  },
  methods: {
    initialize() {
      this.$http
        .get(`/api/restaurant/${this.$route.params.id}`)
        .then((res) => {
          this.restaurant = res.data.data;
          this.restaurantMarker = _.clone(res.data.data);
          this.restaurantMarker.marker = [
            this.restaurantMarker.location.lat,
            this.restaurantMarker.location.lon,
          ];
          this.centerCoord = this.restaurantMarker.marker;
          this.restaurantMarker = [this.restaurantMarker];
          this.reviews =
            this.restaurant.reviews !== null ? this.restaurant.reviews : [];
          if (this.restaurant.ratingStats !== null)
            this.ratingStats = this.restaurant.ratingStats;
          if (this.restaurant.likes !== null) {
            this.likes = this.restaurant.likes.length;
            if (this.authenticatedUser !== null) {
              this.isLiked = this.restaurant.likes.indexOf(
                this.authenticatedUser.username
              );
            }
          }
          if (this.restaurant.beenThere !== null) {
            if (this.authenticatedUser !== null) {
              this.hasBeenThere = this.restaurant.beenThere.indexOf(
                this.authenticatedUser.username
              );
            }
            this.hasBeenThereCount = this.restaurant.beenThere.length;
          }
          if (this.restaurant.menus !== null) {
            this.restaurant.menus.forEach((menu) => {
              let tempObj = {};
              tempObj[menu.name] = {
                price: menu.price,
                qty: 0,
              };
              return Object.assign(this.menuWithQty, tempObj);
            });
          }
        })
        .catch((err) => {});
    },
    convertHour(time) {
      let timeString = time;
      let H = +timeString.substr(0, 2);
      let h = H % 12 || 12;
      let ampm = H < 12 ? "  AM" : "  PM";
      timeString = h + timeString.substr(2, 3) + ampm;
      return timeString;
    },
    onStarClicked(star) {
      this.rating = star;
      this.dialog = true;
    },
    shareViaWebShare() {
      if (navigator.share) {
        navigator.share({
          title: "I've been there !!",
          text: `Come visit ${this.restaurant.name}`,
          url: window.location.pathname,
        });
      } else {
        store.dispatch("setSnackbar", {
          message: "Browser is not supported to share.",
          isShown: true,
          color: "error",
        });
      }
    },
    onOrder() {
      this.orderDialog = true;
    },
    async onLikeBtnClicked() {
      try {
        await this.$http.post(
          `/api/user/restaurant/like`,
          {},
          {
            headers: {
              "restaurant-id": this.$route.params.id,
            },
          }
        );

        let tempLikes;
        let message = "Liked.";
        let tempAuthenticatedUser = Object.assign({}, this.authenticatedUser);

        if (this.authenticatedUser.likes !== null) {
          tempLikes = [...this.authenticatedUser.likes];
          let index = tempLikes.indexOf(this.$route.params.id);

          if (index !== -1) {
            tempLikes.splice(index, 1);
            message = "Disliked.";
            this.likes--;
            this.isLiked = -1;
          } else {
            tempLikes.push(this.$route.params.id);
            this.likes++;
            this.isLiked = 1;
          }
        } else {
          tempLikes = [this.$route.params.id];
          this.likes++;
          this.isLiked = 1;
        }

        tempAuthenticatedUser.likes = [...tempLikes];
        store.dispatch("setAuthenticatedUser", tempAuthenticatedUser);
        store.dispatch("setSnackbar", {
          message,
          isShown: true,
          color: "success",
        });
      } catch (err) {
        store.dispatch("setSnackbar", {
          message: "Something went wrong.",
          isShown: true,
          color: "error",
        });
      }
    },
    async onBeenThereBtnClicked() {
      try {
        await this.$http.post(
          `/api/user/restaurant/been-there`,
          {},
          {
            headers: {
              "restaurant-id": this.$route.params.id,
            },
          }
        );

        store.dispatch("setSnackbar", {
          message: "Submitted.",
          isShown: true,
          color: "success",
        });
      } catch (err) {
        store.dispatch("setSnackbar", {
          message: "Something went wrong.",
          isShown: true,
          color: "error",
        });
      }
    },
    addQty(menuName) {
      this.menuWithQty[menuName].qty += 1;
      let tempObj = Object.assign({}, this.menuWithQty);
      delete this.menuWithQty[menuName];
      this.menuWithQty = Object.assign({}, tempObj);
    },
    minusQty(menuName) {
      if (this.menuWithQty[menuName].qty > 0)
        this.menuWithQty[menuName].qty -= 1;
      let tempObj = Object.assign({}, this.menuWithQty);
      delete this.menuWithQty[menuName];
      this.menuWithQty = Object.assign({}, tempObj);
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    async onOrderSubmit() {
      try {
        let requestBody = [];
        for (let [key, value] of Object.entries(this.menuWithQty)) {
          if (value.qty !== 0) {
            requestBody.push({
              name: key,
              price: value.price,
              qty: value.qty,
            });
          }
        }

        let response = await this.$http.post(
          `/api/user/restaurant/${this.$route.params.id}/order`,
          {
            orderMenu: requestBody,
            time: this.orderMenuTime,
          }
        );

        store.dispatch("setSnackbar", {
          message: "Order success.",
          isShown: true,
          color: "success",
        });
        this.orderDialog = false;
      } catch (err) {
        store.dispatch("setSnackbar", {
          message: "Something went wrong, please try again.",
          isShown: true,
          color: "error",
        });
        this.orderDialog = false;
      }
    },
    async onReviewSubmit() {
      try {
        this.dialog = false;
        await this.$http.post(
          `/api/user/restaurant/review`,
          {
            star: this.rating,
            comment: this.comment,
          },
          {
            headers: {
              "restaurant-id": this.$route.params.id,
            },
          }
        );

        let hasReviewed = false;
        this.reviews.forEach((review) => {
          if (review.user === this.authenticatedUser.username) {
            review.star = this.rating;
            review.comment = this.comment;
            hasReviewed = true;
          }
        });

        if (!hasReviewed) {
          let review = {
            comment: this.comment,
            star: this.rating,
            restoId: this.$route.params.id,
            user: this.authenticatedUser.username,
            id: "temp-id",
          };
          this.reviews.push(review);
        }

        store.dispatch("setSnackbar", {
          message: "Review submitted.",
          isShown: true,
          color: "success",
        });
      } catch (err) {
        store.dispatch("setSnackbar", {
          message: "Something went wrong, Please try again later.",
          isShown: true,
          color: "error",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$font: "Century Gothic";
$large-text: 16px;
$medium-text: 14px;
$small-text: 12px;
$font-color: #15261c;
$grey-color: #737373;
$dark-grey-color: #434343;
$highlight-color: #339162;
$five-star-color: #41e296;
$four-star-color: #3ab87b;
$three-star-color: #339162;
$two-star-color: #2a6b49;
$one-star-color: #204732;

#app {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.btn-icon-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.not-found {
  width: 100%;
  padding: 50px;
}

.divider {
  margin: 3px 0 5px 0;
  opacity: 0.5;
  margin-bottom: 10px;
  margin-top: 15px;
}

.image {
  width: 100%;
  max-height: 230px;
  overflow: hidden;
}

.resto-image {
  width: 100%;
}

span {
  color: $font-color;
  opacity: 0.9;
}

.highlight-text {
  font-size: $medium-text;
  color: $highlight-color;
  font-weight: bold;
}

.large-text {
  font-size: $large-text;
  opacity: 0.8;
  font-weight: bold;
}

.medium-text {
  font-size: $medium-text;
  color: $grey-color;
}

.small-text {
  font-size: $small-text;
  color: $grey-color;
}

.small-title {
  font-size: 13px;
  padding-left: 17px;
  padding-bottom: 10px;
  font-weight: bold;
  color: $dark-grey-color;
}

.star-rating {
  background-color: #41e296;
  border-radius: 10px;
  font-weight: bold;
  width: 80%;
  padding-right: 0px;
  flex-direction: column;
}

.star-rating-text {
  color: white;
  font-size: 33px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.progress-bar {
  width: 100%;
  border-radius: 5px;
  background-color: #caf7db;
  margin-top: 5px;
  height: 50%;
}

.progress {
  height: 100%;
  border-radius: 5px;
}

.five {
  background-color: $five-star-color;
  width: var(--five-star-width);
}

.four {
  background-color: $four-star-color;
  width: var(--four-star-width);
}

.three {
  background-color: $three-star-color;
  width: var(--three-star-width);
}

.two {
  background-color: $two-star-color;
  width: var(--two-star-width);
}

.one {
  background-color: $one-star-color;
  width: var(--one-star-width);
}

.address {
  color: $grey-color;
  opacity: 0.9;
  font-size: 13px;
}

.col {
  padding-top: 0;
  padding-bottom: 0;
}

.v-dialog__content {
  z-index: 2002 !important;
}

.padding-top {
  padding-top: 7px;
}

.align-left {
  text-align: left;
}

.no-padding {
  padding: 0px;
}

.margin-bottom {
  margin-bottom: 30px;
}

.no-margin-top {
  margin-top: 0px;
  padding-top: 0px;
}

.margin-top-minus {
  margin-top: -5px;
  padding-top: 0px;
}

.calendar-div {
  position: static !important;
}
</style>
