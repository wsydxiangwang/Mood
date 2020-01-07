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
		path: '/article',
		name: "article",
		component: resolve => require(['@/views/article/article'], resolve)
	},
	{
		path: '/article/NewArticle',
		name: "articleNew",
		component: resolve => require(['@/views/article/NewArticle'], resolve)
	},
	{
		path: '/article/edit',
		name: "articleEdit",
		component: resolve => require(['@/views/article/edit'], resolve)
	},
	{
		path: '/phrase',
		name: "phrase",
		component: resolve => require(['@/views/phrase/phrase'], resolve)
	},
	{
		path: '/phrase/NewPhrase',
		name: "phraseNew",
		component: resolve => require(['@/views/phrase/NewPhrase'], resolve)
	},
	{
		path: '/phrase/edit',
		name: "phraseEdit",
		component: resolve => require(['@/views/phrase/edit'], resolve)
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
