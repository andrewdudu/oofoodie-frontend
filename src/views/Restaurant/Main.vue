<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
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

    <img v-if="restaurant == null" class="not-found" src="@/assets/restaurant-not-found.svg" />
    <div class="image">
      <img class="resto-image" :src="`/api/img/${restaurant.image}`" />
    </div>
    <v-container style="padding-top: 7px">
      <v-row>
        <v-col cols="10" style="text-align: left">
          <span class="large-text">{{ restaurant.name }}</span>
        </v-col>
        <v-col cols="2">
          <span>
            <star-box v-bind:star="4.5"></star-box>
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" style="text-align: left; margin-top: -7px">
          <span class="small-text">100 likes - 58 been there</span>
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
          <Map style="height: 250px; margin-bottom: 5px;" v-bind:markers="marker" />
        </v-col>
      </v-row>
      <v-divider class="divider" />
      <v-row style="margin-top: 10px; margin-bottom: 10px">
        <v-col cols="3">
          <div class="btn-icon-div">
            <v-btn icon color="deep-orange">
              <v-icon size="30" color="#838383">mdi-thumb-up</v-icon>
            </v-btn>
            <span class="medium-text">Like</span>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="btn-icon-div">
            <v-btn icon color="deep-orange">
              <v-icon size="40" color="#838383">mdi-bookmark-check</v-icon>
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
          <span v-bind:class="[today === key ? 'highlight-text' : '']">
            {{
            key[0].toUpperCase() + key.slice(1)
            }}
          </span>
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

      <v-divider class="divider" style="margin-bottom: 10px; margin-top: 15px" />

      <v-row>
        <span class="small-title">Trustworthy Review</span>
      </v-row>
      <v-row>
        <v-col cols="4" style="display: flex;justify-content: center; padding-right: 0">
          <div class="star-rating">
            <span class="star-rating-text">
              <p style="margin: 0">4.9</p>
              <p style="font-size: 13px; margin: 0">103 likes</p>
            </span>
          </div>
        </v-col>
        <v-col cols="7" class="small-text">
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
                  <span>89 %</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">4 Star</v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="8" style="padding: 0px;">
                  <div class="progress-bar">
                    <div class="progress four"></div>
                  </div>
                </v-col>
                <v-col cols="4">
                  <span>89 %</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">3 Star</v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="8" style="padding: 0px;">
                  <div class="progress-bar">
                    <div class="progress three"></div>
                  </div>
                </v-col>
                <v-col cols="4">
                  <span>89 %</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">2 Star</v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="8" style="padding: 0px;">
                  <div class="progress-bar">
                    <div class="progress two"></div>
                  </div>
                </v-col>
                <v-col cols="4">
                  <span>89 %</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">1 Star</v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="8" style="padding: 0px;">
                  <div class="progress-bar">
                    <div class="progress one"></div>
                  </div>
                </v-col>
                <v-col cols="4">
                  <span>89 %</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="divider" style="margin-bottom: 10px; margin-top: 15px" />

      <div v-for="review in reviews" :key="review.reviewId">
        <v-row>
          <v-col cols="8">
            <v-row>
              <v-col cols="12" style="text-align: left;">
                <span class="medium-text" style="font-weight: bold;">{{ review.user }}</span>
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

        <v-divider class="divider" style="margin-bottom: 10px; margin-top: 15px" />
      </div>
    </v-container>
  </div>
</template>

<script>
import StarBox from "@/components/StarBox.vue";
import Map from "@/components/Map.vue";
import ReviewStar from "@/components/ReviewStar.vue";
import moment from "moment";
import store from "@/store.js";
import { mapGetters } from "vuex";

export default {
  components: {
    StarBox,
    Map,
    ReviewStar
  },

  data() {
    return {
      dialog: false,
      restaurant: null,
      marker: null,
      rating: 0,
      comment: "",
      reviews: [],
      today: moment()
        .isoWeekday(moment().day())
        .format("dddd")
        .toLowerCase()
    };
  },

  created() {
    this.initialize();
  },

  computed: {
    ...mapGetters(["authenticatedUser"])
  },

  methods: {
    initialize() {
      this.$http.get(`/api/restaurant/${this.$route.params.id}`).then(res => {
        this.restaurant = res.data.data;
        this.marker = [
          [res.data.data.location.lat, res.data.data.location.lon]
        ];
        this.reviews = this.restaurant.reviews;
        console.log(this.restaurant);
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
    onStarClicked(star) {
      this.rating = star;
      this.dialog = true;
    },
    shareViaWebShare() {
      if (navigator.share) {
        navigator.share({
          title: "I've been there !!",
          text: `Come visit ${this.restaurant.name}`,
          url: window.location.pathname
        });
      } else {
        store.dispatch("setSnackbar", {
          message: "Browser is not supported to share.",
          isShown: true,
          color: "error"
        });
      }
    },
    async onReviewSubmit() {
      try {
        this.dialog = false;
        await this.$http.post(
          `/api/user/restaurant/${this.$route.params.id}/review`,
          {
            star: this.rating,
            comment: this.comment
          }
        );

        let hasReviewed = false;
        this.reviews.forEach(review => {
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
            id: "temp-id"
          };
          this.review.push(review);
        }

        store.dispatch("setSnackbar", {
          message: "Review submitted.",
          isShown: true,
          color: "success"
        });
      } catch (err) {
        store.dispatch("setSnackbar", {
          message: "Something went wrong, Please try again later.",
          isShown: true,
          color: "error"
        });
      }
    }
  }
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
  width: 50%;
  height: 100%;
  border-radius: 5px;
}

.five {
  background-color: $five-star-color;
}

.four {
  background-color: $four-star-color;
}

.three {
  background-color: $three-star-color;
}

.two {
  background-color: $two-star-color;
}

.one {
  background-color: $one-star-color;
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
</style>
