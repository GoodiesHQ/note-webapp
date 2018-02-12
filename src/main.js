// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'

import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(VueResource)
Vue.use(VueClipboard)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
