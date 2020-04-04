<template>
  <div class="md-layout home">
    <div class="search-input">
      <div class="search-div">
        <input class="search" placeholder="Type here to Search Restaurant" />
        <md-icon>search</md-icon>
      </div>
    </div>
    <span class="voucher-title">Vouchers</span>
    <hooper :infiniteScroll="true" :autoPlay="true" :playSpeed="3000">
      <slide>
        <img src="../assets/voucher.jpg" />
      </slide>
      <slide>
        <img src="../assets/voucher2.png" />
      </slide>
      <hooper-pagination slot="hooper-addons"></hooper-pagination>
    </hooper>
  </div>
</template>

<script>
import { Hooper, Slide, Pagination as HooperPagination } from "hooper";
import "hooper/dist/hooper.css";

export default {
  components: {
    Hooper,
    Slide,
    HooperPagination
  }
};
</script>

<style lang="scss" scoped>
$font: "Century Gothic";
$title_size: 12px;

.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
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

.search-bar {
  width: 30%;
}

.search-input {
  display: flex;
  justify-content: center;
  background-image: url("../assets/home.jpg");
  background-size: 100% auto;
  background-repeat: no-repeat;
  padding-top: 13vh;
  height: 30%;
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
