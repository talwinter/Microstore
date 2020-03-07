import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BVToastPlugin } from 'bootstrap-vue'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(BootstrapVue);
Vue.use(BVToastPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
