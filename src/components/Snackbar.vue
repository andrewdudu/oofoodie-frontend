<template>
  <v-snackbar :color="snackbar.color" v-model="snackbar.isShown" class="snackbar" top>
    {{ snackbar.message }}
    <v-btn text @click="onCloseClicked">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["snackbar"]),
  },
  methods: {
    onCloseClicked() {
      this.$store.dispatch("setSnackbar", {
        isShown: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.snackbar {
  z-index: 2000;
  margin-top: 30px;
}
</style>