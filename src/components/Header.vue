<template>
  <div class="header-component">
    <img class="default-logo" src="../assets/default.png" />
    <v-btn
      v-if="btn !== null"
      small
      color="#41e296"
      dark
      class="header-btn"
      @click="onBtnClicked"
    >{{ btn }}</v-btn>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    btn: {
      type: String,
      default: null
    }
  },
  methods: {
    onBtnClicked() {
      this.$emit("onBtnClicked", null);
    }
  }
};
</script>

<style lang="scss" scoped>
$max_height_logo: 10vw;
$break_small: 620px;

.header-btn {
  align-self: center;
  position: absolute;
  right: 10px;
}

.header-component {
  display: flex;
  justify-content: center;
  padding: 10px;
  width: 100%;
  @media screen and (max-width: $break_small) {
    height: 70px;
  }
  @media screen and (min-width: $break_small+1) {
    height: 90px;
  }
}

.default-logo {
  align-self: center;
  @media screen and (max-width: $break_small) {
    height: 50px;
  }
  @media screen and (min-width: $break_small+1) {
    height: 70px;
  }
}
</style>
