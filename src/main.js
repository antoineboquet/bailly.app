import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/app.scss'

Vue.config.productionTip = false
Vue.config.ignoredElements = ['ion-icon']

new Vue({ router, store, render: h => h(App) }).$mount('#app')
