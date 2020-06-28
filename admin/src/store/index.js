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
        // 缓存评论或文章
		setCache(state, payload){
            state.$data[`${payload.type}Qty`] = payload.total;
			state[payload.type][payload.page] = payload.data;
        },
        // 清楚评论或文章
		resetCache(state, type){
			state[type] = {};
        },
        // 保存数据
        allData(state, data){
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