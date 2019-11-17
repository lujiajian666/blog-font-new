import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import { Pagination,Input,Form,FormItem,Button,Message,Icon,Loading} from 'element-ui'
Vue.use(Pagination);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Loading);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

//登录组件
import loginComponent from './components/login/index.js';
Vue.use(loginComponent);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
