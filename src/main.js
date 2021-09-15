import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { io } from "socket.io-client"
import VueSocketIO from 'vue-socket.io'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

const socketio_options = {
  auth: {
    token: localStorage.jwt
  },
  autoConnect: false,
}

Vue.use(new VueSocketIO({
    connection: io(`${process.env.VUE_APP_API_URL}`, socketio_options),
  })
)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
