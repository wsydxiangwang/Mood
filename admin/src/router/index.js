import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import article from '../views/article.vue'
import articleNew from '../views/articleNew.vue'
import phrase from '../views/phrase.vue'
import phraseNew from '../views/phraseNew.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: index
	},
	{
		path: '/article',
		component: article
	},
	{
		path: '/articleNew',
		component: articleNew
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
