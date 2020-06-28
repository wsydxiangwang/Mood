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

// 保存更新状态数据
Vue.prototype.$infoUpdate = () => {
  http.get('/info').then(res => {
    if(res && res.data.status == 1){
      const data = res.data.body;
      store.commit('allData', data)
    }
  })
}

new Vue({
  store,
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
