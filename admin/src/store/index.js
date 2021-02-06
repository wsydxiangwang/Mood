import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
        $data: {},
        menu: ''
	},
	mutations: {
        // 信息
        data(state, data){
            state.$data = data
        },
        // 已读
        updateUnread(state){
            state.$data.unread = 0
        },
        // 更新信息
        updataInfo(state, data){
            state.$data.info = data
        },
        // 动态导航
        setMenu(state, data){
            state.menu = data
        }
	}
})

export default store