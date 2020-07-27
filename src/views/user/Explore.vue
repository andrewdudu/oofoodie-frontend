<template>
  <div>
    <Header />
    <v-container>
      <v-autocomplete
        :search-input.sync="search"
        :onChange="debounceInput()"
        color="grey"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="Search"
        placeholder="Start typing to Search"
        prepend-icon="search"
        return-object
      ></v-autocomplete>
      <v-row v-for="restaurant in restaurants" :key="restaurant.id">
        <router-link :to="`/restaurant/${restaurant.id}`" style="text-decoration: none">
          <card v-bind:data="restaurant"></card>
        </router-link>
      </v-row>
      <img
        v-if="restaurants.length === 0"
        src="@/assets/empty.svg"
        style="width: 100%; padding: 30px;margin-top: 50px;"
      />
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

  methods: {
    async onChange() {
      if (this.query !== null) this.search = this.query;
      try {
        if (this.search !== null && this.search !== "") {
          let response = await this.$http.get(
            `/api/restaurant/search?q=${this.search}`
          );

          response.data.data.map((resto) => {
            resto.image = `http://128.199.110.11:8080/api/img/${resto.image}`;
            return resto;
          });

          this.restaurants = _.cloneDeep(response.data.data);
          this.search = null;
          this.query = null;
        }
      } catch (err) {}
    },
  },

  created() {
    this.debounceInput = _.debounce(this.onChange, 500);
  },
};
</script>

<style lang="scss" scoped>
.row {
  margin: 10px 0px 10px 0px;
}
</style>