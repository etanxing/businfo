import Vue from 'vue'
import App from './App.vue'
import StopCard from './StopCard.vue'

// register
Vue.component('stop-card', StopCard)

new Vue({
  el: '#app',
  render: h => h(App)
})
