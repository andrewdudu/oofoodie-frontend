<template>
  <div id="app">
    <Map style="height: 100%;" v-bind:isAddMarker="isAddMarker" @onAddMarker="onAddMarker" />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";
import router from "@/router.js";

export default {
  components: {
    Map
  },
  data() {
    return {
      isAddMarker: true
    };
  },
  methods: {
    onAddMarker(e) {
      router.push(`/suggest/form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    }
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  margin-bottom: 0;
}
</style>
