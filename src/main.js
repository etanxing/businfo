import Vue from 'vue'
import { Button, Input, Row, Col, Autocomplete } from 'element-ui'
import App from './App.vue'
import StopCard from './StopCard.vue'

// register
Vue.use(Autocomplete)
Vue.use(Button)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.component('stop-card', StopCard)

new Vue({
  el: '#app',
  render: h => h(App)
})
