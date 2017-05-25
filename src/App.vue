<template>
  <div id="app">
    <template v-for="card in cards">
      <stop-card :initial-stop-id=card.stopId :initial-line-rule=card.lineRule></stop-card>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "app",
  data() {
    return {
      cards: [
        {
          stopId: 13348,
          lineRule: "82"
        },
        {
          stopId: 13674,
          lineRule: "82"
        },
        {
          stopId: 13664,
          lineRule: "82"
        },
        {
          stopId: 13662,
          lineRule: "82"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
