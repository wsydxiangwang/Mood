import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1fc95799 = () => interopDefault(import('..\\pages\\about.vue' /* webpackChunkName: "pages_about" */))
const _f8b810fc = () => interopDefault(import('..\\pages\\article.vue' /* webpackChunkName: "pages_article" */))
const _a24e5418 = () => interopDefault(import('..\\pages\\envelope.vue' /* webpackChunkName: "pages_envelope" */))
const _3db79490 = () => interopDefault(import('..\\pages\\rain.vue' /* webpackChunkName: "pages_rain" */))
const _97b45e54 = () => interopDefault(import('..\\pages\\subscribe.vue' /* webpackChunkName: "pages_subscribe" */))
const _3f81325e = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))
const _4c1ffd56 = () => interopDefault(import('..\\pages\\_articleId.vue' /* webpackChunkName: "pages__articleId" */))

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
    component: _1fc95799,
    name: "about"
  }, {
    path: "/article",
    component: _f8b810fc,
    name: "article"
  }, {
    path: "/envelope",
    component: _a24e5418,
    name: "envelope"
  }, {
    path: "/rain",
    component: _3db79490,
    name: "rain"
  }, {
    path: "/subscribe",
    component: _97b45e54,
    name: "subscribe"
  }, {
    path: "/",
    component: _3f81325e,
    name: "index"
  }, {
    path: "/:articleId",
    component: _4c1ffd56,
    name: "articleId"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
