import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6e459002 = () => interopDefault(import('..\\pages\\article.vue' /* webpackChunkName: "pages_article" */))
const _31f5c7ff = () => interopDefault(import('..\\pages\\myself.vue' /* webpackChunkName: "pages_myself" */))
const _73cb23ca = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))
const _24d0e08e = () => interopDefault(import('..\\pages\\_articleId.vue' /* webpackChunkName: "pages__articleId" */))

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
    component: _6e459002,
    name: "article"
  }, {
    path: "/myself",
    component: _31f5c7ff,
    name: "myself"
  }, {
    path: "/",
    component: _73cb23ca,
    name: "index"
  }, {
    path: "/:articleId",
    component: _24d0e08e,
    name: "articleId"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
