<template>
  <div>
    <div class="map">
      <l-map :zoom="zoom" :center="center">
        <l-marker :lat-lng="center"></l-marker>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      </l-map>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 20,
      center: [-6.93, 107.6],
      bounds: null
    };
  }
};
</script>

<style>
.map {
  width: 100%;
  height: 100vh;
  z-index: 0;
}
</style>