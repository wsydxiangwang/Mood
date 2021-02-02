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

// 获取个人信息
Vue.prototype.$infoUpdate = () => {
    http.get('/info').then(res => {
		if(res && res.data.status == 1){
			const data = res.data.body;
			store.commit('info', data)
		}
    })
}

Vue.prototype.$getDate = (data) => {
	return `${data.time} ${data.month.en} ${data.day.on}`
}

let loading = null
Vue.prototype.$request = async (fn, dom = '.container') => {
	loading && loading.close()
	loading = ElementUI.Loading.service({ target: dom })
	new Promise((resolve) => {
		resolve(fn())
	}).then(res => {
		loading.close()
	})
}

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
