import loginCommpoent from './index.vue';
import Vue from 'vue';
import cookie from 'js-cookie';
let login = Vue.extend(loginCommpoent);

export default {
  instance: null,
  el: '',
  install() {
    Vue.prototype.$login = {
      _self: this,
      checkLogin: this.checkLogin
    };
  },
  getInstance(el, propsData) {
    if (el === this.el && this.instance) {
      this.instance.show = true;
      return Promise.resolve(this.instance);
    } else {
      //没绑定，不执行then的逻辑
      return new Promise((resolve, reject) => {
        const instance = new login({
          propsData
        }).$mount()
        document.querySelector(el).appendChild(instance.$el);
        [this.el, this.instance] = [el, instance]
        resolve(instance);
      })
    }
  },
  checkLogin(el = 'body', propsData = {}) {
    const username = cookie.get('username');
    if(username) {
      return Promise.resolve();
    } else {
      return this._self.getInstance(el, propsData).then(_ => {
        return Promise.reject({
          message: '未登录'
        });
      })
    }
  }
}
