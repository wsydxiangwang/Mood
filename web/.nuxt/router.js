import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _74ef11c1 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _2643c7aa = () => interopDefault(import('../pages/article.vue' /* webpackChunkName: "pages/article" */))
const _60330acc = () => interopDefault(import('../pages/envelope.vue' /* webpackChunkName: "pages/envelope" */))
const _fe6ad2e0 = () => interopDefault(import('../pages/rain.vue' /* webpackChunkName: "pages/rain" */))
const _2e1236fe = () => interopDefault(import('../pages/subscribe.vue' /* webpackChunkName: "pages/subscribe" */))
const _d6b226f4 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _0fc05c2e = () => interopDefault(import('../pages/_articleId.vue' /* webpackChunkName: "pages/_articleId" */))

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
    path: "/about",
    component: _74ef11c1,
    name: "about"
  }, {
    path: "/article",
    component: _2643c7aa,
    name: "article"
  }, {
    path: "/envelope",
    component: _60330acc,
    name: "envelope"
  }, {
    path: "/rain",
    component: _fe6ad2e0,
    name: "rain"
  }, {
    path: "/subscribe",
    component: _2e1236fe,
    name: "subscribe"
  }, {
    path: "/",
    component: _d6b226f4,
    name: "index"
  }, {
    path: "/:articleId",
    component: _0fc05c2e,
    name: "articleId"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
