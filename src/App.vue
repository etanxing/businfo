<template>
  <div id="app">
    <template v-for="card in cards">
      <stop-card
        :initial-stop-name=card.stopName
        :initial-line-rule=card.lineRule
        :initial-stop-code=card.stopCode></stop-card>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'app',
  data() {
    return {
      cards: [
        {
          stopCode: 13348,
          stopName: 'Stop E1 Currie St - North side',
          lineRule: ''
        },
        {
          stopCode: 16287,
          stopName: 'Stop V2 King William St - West side',
          lineRule: ''
        },
        {
          stopCode: '',
          stopName: '',
          lineRule: ''
        },
        {
          stopCode: '',
          stopName: '',
          lineRule: ''
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
