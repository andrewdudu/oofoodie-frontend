<template>
  <div id="app">
    <Map v-bind:isAddMarker="isAddMarker" @onAddMarker="onAddMarker" />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";
import router from "@/router.js";

export default {
  components: {
    Map,
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

<style lang="scss"></style>
