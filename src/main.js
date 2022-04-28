import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxiosPlugin from 'vue-axios-plugin'
import vuetify from './plugins/vuetify'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false
Vue.use(VueAxiosPlugin, {
  baseURL: 'http://localhost:9000'
})
Vue.use(mavonEditor)
store.commit('baseURL', 'http://localhost:9000')
new Vue({
  router,
  store,
  vuetify,

  render: function (h) {
    return h(App)
  }
}).$mount('#app')