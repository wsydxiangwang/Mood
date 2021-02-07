import Vue from 'vue'
import http from './http'
import store from './store'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

Vue.prototype.$http = http
Vue.config.productionTip = false

let loading = null

// 设置个人信息 vuex
Vue.prototype.$infoUpdate = () => {
    http.get('/info').then(res => {
		if(res && res.data.status == 1){
			const data = res.data.body;
			store.commit('data', data)
		}
    })
}

/**
 * @param {Object} data form对象集合
 */
Vue.prototype.$formData = (data) => {
	const form = new FormData()
	for (let key in data) {
		form.append(key, data[key])
	}
	return form
}

// 时间格式获取
Vue.prototype.$getDate = (data) => {
	return `${data.time} ${data.month.en} ${data.day.on}`
}

/**
 * @param {Function} fn 		执行异步方法
 * @param {String} dom 			Loading目标DOM
 * @param {Boolean} scrollTop 	回到顶部
 */
Vue.prototype.$request = async (fn, dom = '.container', scrollTop = true) => {
	loading && loading.close()
	loading = ElementUI.Loading.service({ target: dom })
	new Promise((resolve) => {
		resolve(fn())
	}).then(res => {
		loading.close()
		scrollTop && (document.querySelector('.content').scrollTop = 0)
	})
}

// 日期转化
Vue.prototype.$dateFormat = () => {
	const date = new Date();
	const opt = {
		"Y": date.getFullYear().toString(),        // 年
		"M": (date.getMonth() + 1).toString(),     // 月
		"D": date.getDate().toString(),            // 日
		"H": date.getHours().toString(),           // 时
		"m": date.getMinutes().toString(),         // 分
	}
	for (let i in opt) {
		opt[i] = opt[i].length == 1 ? opt[i].padStart(2, "0") : opt[i]
	}
	const time = `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`
	return time
}

new Vue({
	store,
	router,
	render: function (h) { return h(App) }
}).$mount('#app')
