<template>
  <div class="star-box">
    <v-icon dark small>star</v-icon>
    <span class="star-rating">{{ star }}</span>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ["star"]
};
</script>

<style lang="scss" scoped>
$font: "Century Gothic";

.star-rating {
  margin-left: 1px;
  font-size: 13px;
}

.star-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #41e296;
  max-width: 50px;
  height: 25px;
  border-radius: 6px;
  font-family: $font;
  font-weight: bold;
  color: white;
}
</style>