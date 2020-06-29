<template>
  <v-card>
    <v-img>
      <img :src="data.img" />
    </v-img>

    <v-card-text class="text--primary">
      <v-row style="margin-bottom: 0px !important">
        <v-col cols="10" class="card-title">{{ data.title }}</v-col>
        <v-col align="center" cols="2">
          <star-box v-bind:star="data.rating"></star-box>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="card-description">{{ data.likes }} Likes</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import StarBox from "@/components/StarBox.vue";

export default {
  name: "Card",
  components: {
    StarBox
  },
  props: ["data"],
  data() {
    return this.data;
  }
};
</script>

<style lang="scss" scoped>
$font: "Century Gothic";
$title_size: 12px;

.star-rating {
  margin-left: 1px;
  font-size: 13px;
}

.star-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #41e296;
  width: 40px;
  height: 25px;
  border-radius: 6px;
  font-family: $font;
  font-weight: bold;
  color: white;
}

.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

img {
  border-radius: 5px;
  width: 100%;
}
</style>
