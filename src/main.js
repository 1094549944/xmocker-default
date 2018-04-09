// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router, { composeWithStore } from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../static/iview.css'
 import '@/assets/stylus/index.styl'

Vue.use(iView)

Vue.config.productionTip = false

composeWithStore(store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})