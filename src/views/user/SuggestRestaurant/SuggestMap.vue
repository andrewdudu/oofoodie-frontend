<template>
  <div id="app">
    <Header />
    <Map style="height: 100%;" v-bind:isAddMarker="isAddMarker" @onAddMarker="onAddMarker" />
    <Footer />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import router from "@/router.js";

export default {
  components: {
    Map,
    Header,
    Footer,
  },
  data() {
    return {
      isAddMarker: true,
    };
  },
  methods: {
    onAddMarker(e) {
      router.push(`/suggest/form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  height: 90%;
  margin-bottom: 0;
}
</style>
