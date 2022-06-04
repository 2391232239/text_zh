import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/swiper-bundle.css'
import 'swiper/dist/css/swiper.css'
//全局样式
import './assets/css/global.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// 导入iconfront
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
// 挂载axios 到Vue的原型prototype的$http
Vue.prototype.$http = axios
// 设置请求的根路径
axios.defaults.baseURL = "http://localhost:8081"

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)	
}).$mount('#app')
