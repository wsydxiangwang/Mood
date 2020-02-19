import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5cfcf5ae = () => interopDefault(import('..\\pages\\article.vue' /* webpackChunkName: "pages_article" */))
const _9343a4d6 = () => interopDefault(import('..\\pages\\myself.vue' /* webpackChunkName: "pages_myself" */))
const _4a380476 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/article",
    component: _5cfcf5ae,
    name: "article"
  }, {
    path: "/myself",
    component: _9343a4d6,
    name: "myself"
  }, {
    path: "/",
    component: _4a380476,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
