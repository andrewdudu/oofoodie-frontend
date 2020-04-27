<template>
  <div>
    <v-row>
      <v-col cols="5">
        <v-avatar color="#616161" size="64">
          <v-icon dark style="font-size: 60px;">mdi-account-circle</v-icon>
        </v-avatar>
      </v-col>
      <v-col cols="7"> </v-col>
    </v-row>

    <v-tabs
      v-model="tab"
      class="elevation-2"
      :centered="centered"
      :grow="grow"
      color="#616161"
      style="box-shadow: none !important;
  -webkit-box-shadow: none !important;"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-if="!isLoggedIn" href="#signin">
        Signin
      </v-tab>
      <v-tab v-if="!isLoggedIn" href="#signup">
        Signup
      </v-tab>
      <v-tab v-if="isLoggedIn" href="#timeline">
        Timeline
      </v-tab>
      <v-tab v-if="isLoggedIn" href="#orders">
        Orders
      </v-tab>

      <v-tab-item value="signin">
        Signin
      </v-tab-item>
      <v-tab-item value="signup">
        Signup
      </v-tab-item>
      <v-tab-item value="timeline">
        timeline
      </v-tab-item>
      <v-tab-item value="orders">
        orders
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      centered: true,
      grow: true,
    };
  },
};
</script>

<style lang="scss">
.row {
  margin: 5px 0px 5px 0;
}
</style>
