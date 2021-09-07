import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_user: null,
    locked: true,
  },
  mutations: {
    set_current_user (state, current_user) {
      state.current_user = current_user
    },
    unlock (state) {
      state.locked = false
    }
  },
  actions: {
  },
  modules: {
  }
})
