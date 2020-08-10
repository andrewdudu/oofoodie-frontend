<template>
  <div id="app">
    <Header />
    <Map
      class="height-full"
      v-bind:centerMoveable="true"
      v-bind:markers="restaurantMarkers"
      v-bind:circle="circle"
    />
    <Footer />
  </div>
</template>

<script>
import Map from "@/components/Map.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "app",
  components: {
    Map,
    Header,
    Footer,
  },
  data() {
    return {
      center: [],
      restaurantMarkers: [],
      markers: [
        [-6.93, 107.66],
        [-6.93, 107.6],
        [-6.93, 107.602],
      ],
    };
  },

  created() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.center = [coords.latitude, coords.longitude];
        this.initialize();
      },
      () => {
        this.center = [-6.93, 107.668];
        this.initialize();
      }
    );
  },

  methods: {
    async initialize() {
      try {
        let response = await this.$http.get(
          `/api/restaurant/nearby?lat=${this.center[0]}&lon=${this.center[1]}`
        );

        this.restaurantMarkers = response.data.data;

        this.restaurantMarkers.map((res) => {
          res.marker = [res.location.lat, res.location.lon];
          return res;
        });
      } catch (err) {}
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  height: 90%;
  margin-bottom: 0;
}

.height-full {
  height: 100%;
}
</style>
