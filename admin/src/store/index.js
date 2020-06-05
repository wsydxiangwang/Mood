import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		comment: {},
		commentTotal: 0
	},
	mutations: {
		setComment(state, payload){
			state.commentTotal = payload.total;
			state.comment[payload.page] = payload.data;
		},
		resetComment(state){
			state.comment = {};
			state.commentTotal = 0;
		}
	},
	actions: {
	},
	modules: {
	}
})

export default store