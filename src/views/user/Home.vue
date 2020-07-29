<template>
  <div>
    <Header />
    <div class="home">
      <div class="search-input">
        <div class="search-div">
          <input
            v-model="search"
            class="search"
            placeholder="Type here to Search Restaurant"
            v-on:keyup.enter="onSubmitSearch"
          />
          <v-icon>search</v-icon>
        </div>
      </div>

      <span class="voucher-title">Vouchers</span>

      <v-container>
        <v-carousel height="210px">
          <v-carousel-item
            cycle
            v-for="voucher in vouchers"
            :to="`/restaurant/${voucher.restaurantId}`"
            :key="voucher.name"
            :src="'http://128.199.110.11:8080/api/img/' + voucher.image"
            reverse-transition="fade-transition"
            transition="fade-transition"
            show-arrows-on-hover
          ></v-carousel-item>
        </v-carousel>
      </v-container>

      <span class="voucher-title">Popular Restaurants</span>
      <div class="horizontal-scroll">
        <div v-bind:key="index" v-for="(data, index) in popularRestaurants">
          <router-link :to="`/restaurant/${data.id}`" style="text-decoration: none">
            <card :class="index === 0 ? '' : 'margin-left'" v-bind:data="data" />
          </router-link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Card from "@/components/Card.vue";
import router from "@/router.js";
import "hooper/dist/hooper.css";

export default {
  components: {
    Header,
    Footer,
    Card,
  },

  data() {
    return {
      search: "",
      popularRestaurants: [],
      vouchers: [],
    };
  },

  created() {
    this.initialize();
  },

  methods: {
    onSubmitSearch() {
      router.push({ path: "explore", query: { q: this.search } });
    },
    async initialize() {
      try {
        let response = await this.$http.get("/api/restaurant/popular");
        let vouchers = await this.$http.get("/api/voucher");

        this.vouchers = vouchers.data.data;

        this.popularRestaurants = response.data.data.map((restaurant) => {
          return {
            id: restaurant.id,
            image: `http://128.199.110.11:8080/api/img/${restaurant.image}`,
            name: restaurant.name,
            ratingStats: restaurant.ratingStats,
            rating:
              restaurant.ratingStats !== null
                ? restaurant.ratingStats.avgStar
                : 0,
            likes: restaurant.likes !== null ? restaurant.likes : 0,
          };
        });
      } catch (err) {}
    },
  },
};
</script>

<style lang="scss" scoped>
$font: "Century Gothic";
$title_size: 12px;

.margin-left {
  margin-left: 10px;
}

.horizontal-scroll {
  padding: 3px 15px 0 15px;
  display: flex;
  overflow-x: auto;
  min-width: 100%;
  -ms-overflow-style: none;
}

.horizontal-scroll::-webkit-scrollbar {
  display: none;
}

.star-rating {
  margin-left: 2px;
}

.star-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #41e296;
  width: 50px;
  height: 25px;
  border-radius: 6px;
  font-family: $font;
  font-weight: bold;
  color: white;
}

.home {
  display: flex;
  flex-direction: column;
  margin-bottom: 70px;
}

.v-card__text {
  padding-top: 7px;
}

.col {
  padding: 0px;
  font-family: $font;
}

.card-description {
  font-family: $font;
  text-align: left;
  padding-left: 3px;
}

.card-title {
  font-weight: bold;
  text-align: left;
  padding-left: 3px;
}

img {
  border-radius: 5px;
}

.v-card {
  margin-bottom: 3px;
  min-width: 250px;
  max-width: 250px;
}

.hooper {
  padding: 3px 15px 0 15px;
}

.voucher-title {
  text-align: left;
  margin-left: 22px;
  margin-top: 5px;
  font-family: $font;
  font-size: $title_size;
  font-weight: bold;
}

.example-slide {
  align-items: center;
  background-color: #666;
  color: #999;
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  min-height: 10rem;
}

.search-input {
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../assets/home.jpg") no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  min-height: 250px;
  width: 100%;
}

.search::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.search {
  font-family: $font;
  border: none;
  width: 90%;
  outline: none;
}

.search-div {
  display: flex;
  padding: 10px;
  background-color: white;
  border: 0;
  border-radius: 16px;
  height: 40px;
  width: 300px;
}
</style>
