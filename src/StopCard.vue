<template>
  <div class="stop-card">
    <section class="stop-card-input" v-show="!showResult">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-autocomplete
            size="large"
            type="number"
            v-model="stopName"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            @select="handleSelect"
            placeholder="Stop code/name">
          </el-autocomplete>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="14" :sm="14" :md="14" :lg="14">
          <el-input size="large" type="number" v-model="lineRule" placeholder="Line number">
            <template slot="prepend">{{stopCode}}</template>
          </el-input>
        </el-col>
        <el-col :xs="10" :sm="10" :md="10" :lg="10">
          <el-button @click="fetch" size="large" type="primary" :disabled="!stopCode" :loading="isFetching">Fetch</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="stop-card-result" v-show="showResult">
      <el-button @click="change" type="primary">Change</el-button>
      <h5>Last updated at {{responseTimestamp | updateDatetime}}</h5>
      <ul>
        <li v-for="line in matchLines">
          {{ line.line }} To {{ line.destination }} {{ line.arrivalTime | timeToNow}} ({{ line.arrivalTime | localTime }})
        </li>
      </ul>
      <p v-show="matchLines.length === 0">No real-time data {{ lineRule? ('matched "' + lineRule + '"') : ''}}</p>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import URI from 'urijs'
import { version } from '../package.json'

const url = new URI(window.location.search)
axios.defaults.params = { version }

export default {
  name: 'stop-card',
  props: ['index', 'initialStopName', 'initialLineRule', 'initialStopCode'],
  data() {
    return {
      showResult: false,
      stopName: this.initialStopName,
      stopCode: this.initialStopCode,
      lineRule: this.initialLineRule || '',
      lines: [],
      responseTimestamp: '',
      isPaused: false,
      isFetching: false
    }
  },
  watch: {
    lineRule: function(val) {
      url.setSearch(`stop${this.index + 1}line`, val)
      history.pushState({}, '', url.normalizeQuery())
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
      this.isFetching = true
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
          .get('/api/fetch/' + this.stopCode)
          .then(resp => {
            this.lines = resp.data.lines
            this.responseTimestamp = resp.data.responseTimestamp
            this.isFetching = false
            this.showResult = true
            this.timeoutID = window.setTimeout(this.request, 1000 * 30)
            resp.data.action && this.handleServerAction(resp.data.action)
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
    },
    querySearchAsync: function(queryString, cb) {
      if (queryString.length > 3) {
        axios.get('/api/search/' + queryString.toLowerCase()).then(resp => {
          cb(resp.data)
        })
      }
    },
    handleSelect(item) {
      this.stopCode = item.code
      url.setSearch(`stop${this.index + 1}code`, item.code)
      url.setSearch(`stop${this.index + 1}name`, item.value)
      history.pushState({}, '', url.normalizeQuery())
    },
    handleServerAction(action) {
      switch (action.type) {
        case 'message':
          const message = action[action.type]
          this.$message(message)
          break
        default:
          break
      }
    }
  },
  filters: {
    localTime: function(value) {
      if (!value) return ''
      return moment(value).format('h:mm a')
    },
    updateDatetime: function(value) {
      if (!value) return ''
      return moment(value).format('h:mm:ss a')
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
  padding: 0.5rem;
  border-bottom: 1px solid #eeeeee;
  .el-autocomplete {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
