import Vue from 'vue'
import SimpleAnalytics from 'simple-analytics-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import '@/styles/app.scss'

Vue.config.productionTip = false
Vue.config.ignoredElements = ['ion-icon']

Vue.use(SimpleAnalytics, {
  domain: 'data.bailly.app',
  skip: process.env.NODE_ENV !== 'production'
})

new Vue({ router, store, render: h => h(App) }).$mount('#app')
