import Vue from 'vue'
import SimpleAnalytics from 'simple-analytics-vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/app.scss'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.config.ignoredElements = ['ion-icon']

Vue.use(SimpleAnalytics, {
  domain: 'data.baily.app',
  skip: process.env.NODE_ENV !== 'production'
})

new Vue({ router, store, render: h => h(App) }).$mount('#app')
