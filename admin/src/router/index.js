import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: index,
		redirect: '/',
		children: [
			{
				path: '/',
				name: "index",
				component: resolve => require(['@/views/index/index'], resolve)
			},
			{
				path: '/article',
				name: "article",
				component: resolve => require(['@/views/article/list'], resolve)
			},
			{
				path: '/article/info',
				name: "info",
				component: resolve => require(['@/views/article/info'], resolve)
			},
			{
				path: '/envelope',
				name: "envelope",
				component: resolve => require(['@/views/envelope/list'], resolve)
			},
			{
				path: '/envelope/info',
				name: "envelopeInfo",
				component: resolve => require(['@/views/envelope/info'], resolve)
			},
			{
				path: '/comment',
				name: "comment",
				component: resolve => require(['@/views/comment'], resolve)
			},
			{
				path: '/subscribe',
				name: "subscribe",
				component: resolve => require(['@/views/subscribe'], resolve)
			},
			{
				path: '/myself',
				name: "myself",
				component: resolve => require(['@/views/myself'], resolve)
			},
			{
				path: '/setting',
				name: "setting",
				component: resolve => require(['@/views/setting/index'], resolve)
			},
		]
	},
	{
		path: '/login/index',
		name: "login", 
		meta: {
			path: '/login/index',
			requireAuth: true,  // 除此路由外，其他都需登录
		},
		component: resolve => require(['@/views/login/main'], resolve)
	},
	{
		path: '/resetPassword',
		name: "resetPassword", 
		meta: {
			path: '/resetPassword',
			requireAuth: true,  // 除此路由外，其他都需登录
		},
		component: resolve => require(['@/views/login/resetPassword'], resolve)
	},
	{
		name: '404',
		path: '/404',
		component: resolve => require(['@/views/404'], resolve)
	},
	{
		path: '*',    // 此处需特别注意至于最底部
		redirect: '/404'
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	let list = ['/article/info', '/envelope/info']
	let name = list.indexOf(to.path) > -1 ? '/' + to.path.split('/')[1] : to.path

	store.commit('setMenu', name)

	console.log(to, from)

	if (to.meta.requireAuth) {
		next()
		console.log('不需要登录')
	} else {
		console.log('需要登录')
		if (localStorage.getItem("Authorization")) {  // 是否已登录
			next()
		} else {
			next({ path: '/login/index' })
		}
	}
})

export default router