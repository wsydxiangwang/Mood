import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
        comment: {},
        article: {},
        $data: {},
        menu: ''
	},
	mutations: {
        // 缓存评论/文章
		setCache(state, { type, data }){
            state.$data[`${type}Qty`] = data.total;
			state[type][data.page] = data.data;
        },
        // 重置评论或文章
		resetCache(state, type){
			state[type] = {};
        },
        // 信息
        info(state, data){
            state.$data = data
        },
        // 已读
        updateUnread(state){
            state.$data.unread = 0;
            state.comment = {}
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