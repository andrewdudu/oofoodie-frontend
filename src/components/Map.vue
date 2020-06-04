<template>
  <div>
    <div v-if="loaded" class="map">
      <l-map
        :zoom="zoom"
        :center="center"
        @click="onClicked"
        :bounds="markers"
        :update:center="test"
      >
        <v-alert
          v-if="locationDisabled"
          dense
          border="left"
          type="warning"
          style="z-index:2000"
        >
          Please allow your
          <strong>browser</strong> to access your <strong>location</strong>.
        </v-alert>
        <l-circle-marker
          :lat-lng="circle.center"
          :radius="circle.radius"
          :color="circle.color"
        />
        <l-marker
          v-if="selectedMarker !== null"
          :lat-lng="selectedMarker"
        ></l-marker>
        <l-marker
          v-for="marker in markers"
          :lat-lng="marker"
          :key="marker"
        ></l-marker>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      </l-map>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { LMap, LTileLayer, LMarker, LCircleMarker } from "vue2-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-circle-marker", LCircleMarker);
Vue.component("l-marker", LMarker);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 20,
      bounds: null,
      selectedMarker: null,
      loaded: false,
      center: null,
      locationDisabled: false,
      circle: {
        center: null,
        radius: 6,
        color: "blue",
      },
    };
  },
  props: ["markers", "isAddMarker"],
  mounted() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.center = [coords.latitude, coords.longitude];
        this.circle.center = this.center;
        this.loaded = true;
      },
      (err) => {
        this.center = [-6.93, 107.668];
        this.circle.center = [-6.93, 107.668];
        this.locationDisabled = true;
        this.loaded = true;
      }
    );
  },
  methods: {
    onClicked(e) {
      if (this.isAddMarker) {
        this.selectedMarker = [e.latlng.lat, e.latlng.lng];
        this.$emit("onAddMarker", e);
      }
    },
  },
};
</script>

<style>
.map {
  width: 100%;
  height: 100vh;
  z-index: 0;
}
</style>
