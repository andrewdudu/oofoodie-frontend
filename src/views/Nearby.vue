<template>
  <div id="app">
    <Map v-bind:markers="markers" v-bind:circle="circle" />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";

export default {
  name: "app",
  components: {
    Map
  },
  data() {
    return {
      isAddMarker: true,
      circle: {
        center: [-6.93, 107.668],
        radius: 6,
        color: "red"
      },
      markers: [
        [-6.93, 107.66],
        [-6.93, 107.6],
        [-6.93, 107.602]
      ]
    };
  }
};
</script>
