import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const APP_TITLE = 'Dictionnaire grec-français — Bailly.app'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },

  {
    path: '/q=:query?',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ './views/Dictionary.vue')
  },

  {
    path: encodeURI('/préférences'),
    name: 'settings',
    meta: {
      title: 'Paramètres'
    },
    component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue')
  },

  {
    path: encodeURI('/à-propos'),
    name: 'about',
    meta: {
      title: 'À propos'
    },
    component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  },

  {
    path: '/:uri',
    name: 'definition',
    component: () => import(/* webpackChunkName: "definition" */ './views/Definition.vue')
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'is-active',
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta && to.meta.title ? to.meta.title : APP_TITLE;
  next()
})

export default router
