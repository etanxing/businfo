<template>
  <div id="app">
    <h2><i>Metro</i>Stops🚏</h2>
    <template v-for="card in cards">
      <stop-card
        :initial-stop-name=card.stopName
        :initial-line-rule=card.lineRule
        :initial-stop-code=card.stopCode></stop-card>
    </template>
    <footer>
      <p>Built with ❤️ and <a herf="https://vuejs.org/" target="_blank">Vuejs</a></p>

      <a href="mailto:william@workswell.com.au?subject=MetroStops" class="el-button el-button--primary el-button--large"><span>Contact Us 🚌</span></a>
    </footer>
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
  text-align: center;
  font-weight: 700;
  color: #2897D0;
  i {
    color: #133D68;
  }
}

footer {
  text-align: center;
  padding-top: 1rem;
  a {
    text-decoration: none;
  }
}

a {
  color: #42b983;
}
</style>
