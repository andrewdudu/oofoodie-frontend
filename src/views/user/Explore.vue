<template>
  <div id="app">
    <Header />
    <v-container>
      <v-text-field
        v-model="search"
        color="grey"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="Search"
        placeholder="Start typing to Search"
        prepend-icon="search"
        return-object
      ></v-text-field>
      <v-row v-for="restaurant in restaurants" :key="restaurant.id">
        <router-link :to="`/restaurant/${restaurant.id}`" style="text-decoration: none">
          <card v-bind:data="restaurant"></card>
        </router-link>
      </v-row>
      <img v-if="restaurants.length === 0" class="img-class" src="@/assets/empty.svg" />
    </v-container>
    <Footer />
  </div>
</template>

<script>
import _ from "lodash";
import Card from "@/components/Card.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Card,
    Header,
    Footer,
  },

  data() {
    return {
      isLoading: false,
      restaurants: [],
      resto: [],
      query: this.$route.query.q,
      search: null,
    };
  },

  watch: {
    search(val) {
      if (!val) return;

      this.debounceInput();
    },
  },

  methods: {
    async onChange() {
      try {
        if (this.search !== "") {
          let response = await this.$http.get(
            `/api/restaurant/search?q=${this.search}`
          );

          response.data.data.map((resto) => {
            resto.image = `http://128.199.110.11/api/img/${resto.image}`;
            return resto;
          });

          this.restaurants = _.cloneDeep(response.data.data);
        }
      } catch (err) {}
    },
    debounceInput: _.debounce(function () {
      this.onChange();
    }, 500),
  },

  created() {
    this.search = this.query;
  },
};
</script>

<style lang="scss" scoped>
#app {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.row {
  margin: 10px 0px 10px 0px;
}

.img-class {
  width: 100%;
  padding: 30px;
  margin-top: 50px;
}
</style>