import Vue from 'vue'
import { Button, Input, Row, Col, Autocomplete, Message, Popover } from 'element-ui'
import App from './App.vue'
import StopCard from './StopCard.vue'

// register
Vue.use(Autocomplete)
Vue.use(Popover)
Vue.use(Button)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.prototype.$message = Message
Vue.component('stop-card', StopCard)

new Vue({
  el: '#app',
  render: h => h(App)
})
