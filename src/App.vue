<template>
  <div id="app">
    <template v-for="card in cards">
      <stop-card :initial-stop-id=card></stop-card>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'app',
  data() {
    return {
      cards: [13348,13674,13664,13662]
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
