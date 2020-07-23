<template>
  <div>
    <div v-if="loaded" class="map">
      <l-map :zoom="zoom" :center="center" @click="onClicked" :bounds="markers">
        <v-alert v-if="locationDisabled" dense border="left" type="warning" style="z-index:2000">
          Please allow your
          <strong>browser</strong> to access your
          <strong>location</strong>.
        </v-alert>
        <l-circle-marker :lat-lng="circle.center" :radius="circle.radius" :color="circle.color" />
        <l-marker v-if="selectedMarker !== null" :lat-lng="selectedMarker"></l-marker>
        <l-marker v-for="restaurant in markers" :lat-lng="restaurant.marker" :key="restaurant.id">
          <v-popup>
            <span>{{ restaurant.name }}</span>
            <br />
            <a :href="'/restaurant/' + restaurant.id">Visit</a>
          </v-popup>
        </l-marker>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      </l-map>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { LMap, LTileLayer, LMarker, LCircleMarker, LPopup } from "vue2-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-circle-marker", LCircleMarker);
Vue.component("l-marker", LMarker);
Vue.component("v-popup", LPopup);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 16,
      bounds: null,
      selectedMarker: null,
      loaded: false,
      center: null,
      locationDisabled: false,
      circle: {
        center: null,
        radius: 6,
        color: "blue"
      }
    };
  },
  props: ["centerCoord", "markers", "isAddMarker"],
  mounted() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!this.centerCoord)
          this.center = [coords.latitude, coords.longitude];
        else this.center = this.centerCoord;
        this.circle.center = [coords.latitude, coords.longitude];
        this.loaded = true;
      },
      err => {
        if (!this.centerCoord) this.center = [-6.93, 107.668];
        else this.centerCoord = this.centerCoord;
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
    }
  }
};
</script>

<style>
.map {
  width: 100%;
  height: 100%;
  z-index: 0;
}

.vue2leaflet-map {
  z-index: 0;
}

.leaflet-control-attribution {
  display: none;
}
</style>
