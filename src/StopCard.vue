<template>
  <div class="stop-card">
    <input type="number" v-model="stopId" placeholder="Please type a stop ID"/>
    <button type="button" @click="fetch">Fetch</button>
    <ul>
      <li v-for="line in lines">
        {{ line.line }} To {{ line.destination }} {{ line.arrivalTime | localTime }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'stop-card',
  data() {
    return {
      stopId: '',
      lines: []
    }
  },
  methods: {
    fetch: function() {
      axios
        .get('http://localhost:3000/api/fetch/' + this.stopId)
        .then(resp => {
          this.lines = resp.data
        })
        .catch(console.log)
    }
  },
  filters: {
    localTime: function(value) {
      if (!value) return ''
      value = moment(value).format('h:mm a')
      return value
    }
  }
}
</script>

<style lang="scss">
.stop-card {
  padding: 1rem;
}
</style>
