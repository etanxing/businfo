<template>
  <div class="stop-card">
    <section class="stop-card-input" v-show="!showResult">
      <input type="number" v-model="stopId" placeholder="Please type a stop ID"/>
      <input type="number" v-model="lineRule" placeholder="Match line"/>
      <button type="button" @click="fetch">Fetch</button>
    </section>
    <section class="stop-card-result" v-show="showResult">
      <button type="button" @click="change">Change</button>
      <h5>Last updated at {{responseTimestamp | updateDatetime}}</h5>
      <ul>
        <li v-for="line in matchLines">
          {{ line.line }} To {{ line.destination }} {{ line.arrivalTime | timeToNow}} ({{ line.arrivalTime | localTime }})
        </li>
      </ul>
      <p v-show="matchLines.length === 0">No real-time data {{ lineRule? 'matched "' + lineRule : '"'}}</p>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'stop-card',
  props: ['initialStopId', 'initialLineRule'],
  data() {
    return {
      showResult: false,
      stopId: this.initialStopId,
      lineRule: this.initialLineRule,
      lineRule: '',
      lines: [],
      responseTimestamp: '',
      isPaused: false
    }
  },
  computed: {
    matchLines: function() {
      return this.lines.filter(line => {
        return line.line.indexOf(this.lineRule) > -1
      })
    }
  },
  methods: {
    fetch: function() {
      this.showResult = true
      this.request()
    },
    change: function() {
      this.showResult = false
      this.clearTimeout()
    },
    request: function() {
      if (!this.isPaused) {
        this.clearTimeout()
        axios
          .get('/api/fetch/' + this.stopId)
          .then(resp => {
            this.lines = resp.data.lines
            this.responseTimestamp = resp.data.responseTimestamp
            this.timeoutID = window.setTimeout(this.request, 1000 * 30);
          })
          .catch(error => {
            console.log(error)
            this.isPaused = true
            this.clearTimeout()
          })
      }
    },
    clearTimeout: function() {
      if (this.timeoutID) window.clearTimeout(this.timeoutID)
    }
  },
  filters: {
    localTime: function(value) {
      if (!value) return ''
      return moment(value).format('h:mm a')
    },
    updateDatetime: function(value) {
      if (!value) return ''
      return moment(value).format("h:mm:ss a")
    },
    timeToNow: function(value) {
      if (!value) return ''
      return moment(value).fromNow()
    }
  }
}
</script>

<style lang="scss">
.stop-card {
  padding: 1rem;
}
</style>
