<template>
  <v-app v-if="isRefreshed" id="app">
    <Loading />
    <Snackbar />
    <router-view />
  </v-app>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Loading from "@/components/Loading.vue";
import Snackbar from "@/components/Snackbar.vue";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isRefreshed: false,
    };
  },
  components: {
    Header,
    Footer,
    Loading,
    Snackbar,
  },
  created() {
    this.getAuthenticated()
      .then((res) => (this.isRefreshed = true))
      .catch((err) => (this.isRefreshed = true));
  },
  methods: {
    ...mapActions(["getAuthenticated"]),
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
