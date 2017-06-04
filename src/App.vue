<template>
  <div id="app">
    <el-popover
      placement="right"
      title="NEVER LOST"
      width="200"
      trigger="click"
      content="The url has contained your stops and lines infomation so bookmark or share it 👌">
      <el-button slot="reference" icon="information" class="btn-info" size="large"></el-button>
    </el-popover>
    <h2><i>Metro</i>Stops🚏</h2>
    <template v-for="(card, index) in cards">
      <stop-card
        :index=index
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
import moment from 'moment'
import URI from 'urijs'

export default {
  name: 'app',
  data() {
    const url = new URI(window.location.search)
    const urlQuery = url.search(true)
    if (!urlQuery.stop1code) {
      url.setSearch(`stop1code`, 13348)
      url.setSearch(`stop1name`, 'Stop E1 Currie St - North side')
      history.pushState({}, '', url.normalizeQuery())
    }

    if (!urlQuery.stop2code) {
      url.setSearch(`stop2code`, 16287)
      url.setSearch(`stop2name`, 'Stop V2 King William St - West side')
      history.pushState({}, '', url.normalizeQuery())
    }
    return {
      //stop1code=13348&stop1name=Stop E1 Currie St - North side&stop1line=82
      //stop2code=16287&stop1name=Stop V2 King William St - West side
      cards: [
        {
          stopCode: urlQuery.stop1code || '13348',
          stopName: urlQuery.stop1name || 'Stop E1 Currie St - North side',
          lineRule: urlQuery.stop1line
        },
        {
          stopCode: urlQuery.stop2code || '16287',
          stopName: urlQuery.stop2name || 'Stop V2 King William St - West side',
          lineRule: urlQuery.stop2line
        },
        {
          stopCode: urlQuery.stop3code,
          stopName: urlQuery.stop3name,
          lineRule: urlQuery.stop3line
        },
        {
          stopCode: urlQuery.stop4code,
          stopName: urlQuery.stop4name,
          lineRule: urlQuery.stop4line
        }
      ]
    }
  }
}
</script>

<style lang="scss">
html, body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-message {
  max-width: 95%;
  white-space: normal;
}

#app {
  color: #2c3e50;
  max-width: 45rem;
  margin: 0 auto;
  .btn-info {
    position: absolute;
    font-size: 20px;
    top: 15px;
    left: 0;
    border: none;
  }
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
