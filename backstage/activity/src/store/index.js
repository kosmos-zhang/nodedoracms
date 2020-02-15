import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import activity from './modules/activity'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    activity,
  },
  getters
})

export default store