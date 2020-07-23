<template>
  <v-bottom-navigation color="purple lighten-1" class="footer">
    <v-btn to="/">
      <span>Home</span>
      <v-icon>home</v-icon>
    </v-btn>

    <v-btn to="/suggest">
      <span>Suggest New</span>
      <v-icon>add_circle</v-icon>
    </v-btn>

    <v-btn to="/nearby">
      <span>Nearby</span>
      <v-icon>location_on</v-icon>
    </v-btn>

    <v-btn to="/explore">
      <span>Explore</span>
      <v-icon>search</v-icon>
    </v-btn>

    <v-btn to="/profile">
      <span>Profile</span>
      <v-icon>account_circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BarRouter",
};
</script>

<style lang="scss" scoped>
$active_icon_color: #339162;

.footer {
  position: fixed;
  background-color: white;
  z-index: 1000;
  bottom: 0;
  left: 0;
}

.v-btn--active {
  color: $active_icon_color !important;
  text-decoration: none !important;
}
</style>
