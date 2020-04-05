<template>
  <div class="home">
    <div class="search-input">
      <div class="search-div">
        <input class="search" placeholder="Type here to Search Restaurant" />
        <v-icon>search</v-icon>
      </div>
    </div>
    <span class="voucher-title">Vouchers</span>
    <hooper :infiniteScroll="true" :autoPlay="true" :playSpeed="3000">
      <slide>
        <img src="../assets/voucher.jpg" />
      </slide>
      <slide>
        <img src="../assets/voucher.jpg" />
      </slide>
      <hooper-pagination slot="hooper-addons"/>
    </hooper>
    <span class="voucher-title">Vouchers</span>
    <div class="horizontal-scroll">
      <div v-bind:key="index" v-for="(data, index) in datas">
        <card :class="index === 0 ? '' : 'margin-left'" v-bind:data="data"></card>
      </div>
    </div>
    <span class="voucher-title">Vouchers</span>
    <div class="horizontal-scroll">
      <div v-bind:key="index" v-for="(data, index) in datas">
        <card :class="index === 0 ? '' : 'margin-left'" v-bind:data="data"></card>
      </div>
    </div>
  </div>
</template>

<script>
import { Hooper, Slide, Pagination as HooperPagination } from "hooper";
import Card from "@/components/Card.vue";
import "hooper/dist/hooper.css";

export default {
  components: {
    Hooper,
    Slide,
    HooperPagination,
    Card
  },
  data() {
    return {
      datas: [
        {
          img:
            "https://b.zmtcdn.com/data/pictures/6/18296336/4c1b3e6ebdbb119fd9325fe87916cb52.jpg?output-format=webp",
          title: "The Magic of Nolem Gur The Magic of Nolem Gur",
          rating: 4.9,
          likes: 21
        },
        {
          img:
            "https://b.zmtcdn.com/data/pictures/6/18296336/4c1b3e6ebdbb119fd9325fe87916cb52.jpg?output-format=webp",
          title: "The Magic of Nolem Gur",
          rating: 4.9,
          likes: 21
        },
        {
          img:
            "https://b.zmtcdn.com/data/pictures/6/18296336/4c1b3e6ebdbb119fd9325fe87916cb52.jpg?output-format=webp",
          title: "The Magic of Nolem Gur",
          rating: 4.9,
          likes: 21
        },
        {
          img:
            "https://b.zmtcdn.com/data/pictures/6/18296336/4c1b3e6ebdbb119fd9325fe87916cb52.jpg?output-format=webp",
          title: "The Magic of Nolem Gur",
          rating: 4.9,
          likes: 21
        },
        {
          img:
            "https://b.zmtcdn.com/data/pictures/6/18296336/4c1b3e6ebdbb119fd9325fe87916cb52.jpg?output-format=webp",
          title: "The Magic of Nolem Gur",
          rating: 4.9,
          likes: 21
        }
      ]
    };
  }
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
  background: url("../assets/home.jpg") no-repeat center center;
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
  border-color: transparent;
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
