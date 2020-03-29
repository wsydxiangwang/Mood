import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: index
	},
	{
		path: '/login',
		name: "login", 
		meta: {
            requireAuth: true,  // 除此路由外，其他都需登录
        },
		component: resolve => require(['@/views/login'], resolve)
	},
	{
		path: '/article',
		name: "article",
		component: resolve => require(['@/views/article/article'], resolve)
	},
	{
		path: '/article/info',
		name: "info",
		component: resolve => require(['@/views/article/info'], resolve)
	},
	{
		path: '/envelope',
		name: "envelope",
		component: resolve => require(['@/views/envelope/envelope'], resolve)
	},
	{
		path: '/envelope/info',
		name: "envelopeInfo",
		component: resolve => require(['@/views/envelope/info'], resolve)
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	/**
	 * 判断路由是否需要登录权限
	 */
	if (!to.meta.requireAuth) {  
		/**
		 * 获取当前的token是否存在
		 * 不存在则进入登录页面
		 */
		if (localStorage.getItem("Authorization")) {
			next();
        } else {
			console.log('未登录 请先登录')
            next({path: '/login'})
        }
    } else {
        next();
    }
})

export default router
