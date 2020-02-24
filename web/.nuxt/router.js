import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _46ea8384 = () => interopDefault(import('..\\pages\\myself.vue' /* webpackChunkName: "pages_myself" */))
const _57fe33fc = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))
const _5c67c006 = () => interopDefault(import('..\\pages\\_article.vue' /* webpackChunkName: "pages__article" */))

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
    path: "/myself",
    component: _46ea8384,
    name: "myself"
  }, {
    path: "/",
    component: _57fe33fc,
    name: "index"
  }, {
    path: "/:article",
    component: _5c67c006,
    name: "article"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
