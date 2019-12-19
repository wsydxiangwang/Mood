import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import article from '../views/article/articleList.vue'
import articleNew from '../views/article/articleNew.vue'
import edit from '../views/article/edit.vue'
import phrase from '../views/phrase.vue'
import phraseNew from '../views/phraseNew.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: index
	},
	{
		path: '/article/articleList',
		component: article
	},
	{
		path: '/article/articleNew',
		component: articleNew
	},
	{
		path: '/article/edit/',
		name: 'edit',
		component: edit
	},
	{
		path: '/phrase',
		component: phrase
	},
	{
		path: '/phraseNew',
		component: phraseNew
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
