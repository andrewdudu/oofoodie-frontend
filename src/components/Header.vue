<template>
  <div class="header-component">
    <img class="default-logo" alt="Vue logo" src="../assets/default.png" />
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String,
  },
};
</script>

<style lang="scss" scoped>
$max_height_logo: 10vw;
$break_small: 620px;

.header-component {
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
  @media screen and (max-width: $break_small) {
    height: 50px;
  }
  @media screen and (min-width: $break_small+1) {
    height: 70px;
  }
}
</style>
