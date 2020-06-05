import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
      comment: {}
  },
  mutations: {
      setComment(state, payload){
        state.comment[payload.page] = payload.data;
      }
  },
  actions: {
  },
  modules: {
  }
})

export default store