<template>
  <v-snackbar :color="Snackbar.color" v-model="Snackbar.isShown" class="snackbar" top>
    {{ Snackbar.message }}
    <v-btn text @click="onCloseClicked">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["snackbar"]),
    Snackbar() {
      return this.snackbar;
    }
  },
  methods: {
    onCloseClicked() {
      this.$store.dispatch("setSnackbar", {
        isShown: false
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.snackbar {
  z-index: 2000;
  margin-top: 30px;
}
</style>