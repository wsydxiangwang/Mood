import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
        comment: {},
        article: {},
        $data: {}
	},
	mutations: {
		setCache(state, payload){
            state.$data[`${payload.type}Qty`] = payload.total;
			state[payload.type][payload.page] = payload.data;
		},
		resetCache(state, type){
			state[type] = {};
        },
        allData(state, data){
            state.$data = data
        },
        updateUnread(state){
            state.$data.unread = 0;
        },
        updataInfo(state, data){
            state.$data.info = data
        }
	},
	actions: {
	},
	modules: {
	}
})

export default store