<template>
  <div class="border" @click="onClicked">
    <span class="star-text">{{ star }}</span>
    <v-icon class="star-text" size="15" :color="color" style="margin-left: 3px;">mdi-star</v-icon>
  </div>
</template>

<script>
export default {
  props: ["star", "color"],
  methods: {
    onClicked(e) {
      this.$emit("click", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.border {
  padding: 4px 7px 4px 7px;
  margin-left: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 1px 8px 1px rgba(220, 220, 220, 1);
  -moz-box-shadow: 0px 1px 8px 1px rgba(220, 220, 220, 1);
  box-shadow: 0px 1px 8px 1px rgba(220, 220, 220, 1);
  font-weight: bold;
  font-size: 13px;
  display: flex;
}

.star-text {
  justify-content: center;
  align-items: center;
}
</style>
