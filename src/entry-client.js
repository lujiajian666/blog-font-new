import { createApp } from './app';
import Vue from 'vue';
import {
  Pagination,
  Input,
  Form,
  FormItem,
  Button,
  Message,
  Icon,
  Loading
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Loading);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

const { app, router, store } = createApp();

if (process.env.HOST_ENV !== 'pro') {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    console.log(matched, prevMatched);
    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false;
    const activated = matched.filter((current, index) => {
      return diffed || (diffed = prevMatched[index] !== current);
    });
    if (!activated.length) {
      return next();
    }

    // 这里如果有加载指示器 (loading indicator)，就触发
    const loading = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)'
    });

    Promise.all(
      activated.map(item => {
        if (item.asyncData) {
          return item.asyncData({ store, route: to });
        }
      })
    )
      .then(() => {
        // 停止加载指示器(loading indicator)
        loading.close();
        next();
      })
      .catch(next);
  });
  app.$mount('#app');
} else {
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
  }
  router.onReady((...arg) => {
    console.log(1, arg);
    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    router.beforeResolve((to, from, next) => {
      console.log(2);
      const matched = router.getMatchedComponents(to);
      const prevMatched = router.getMatchedComponents(from);
      console.log(matched, prevMatched);
      // 我们只关心非预渲染的组件
      // 所以我们对比它们，找出两个匹配列表的差异组件
      let diffed = false;
      const activated = matched.filter((current, index) => {
        return diffed || (diffed = prevMatched[index] !== current);
      });
      if (!activated.length) {
        return next();
      }
  
      // 这里如果有加载指示器 (loading indicator)，就触发
      const loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
  
      Promise.all(
        activated.map(item => {
          if (item.asyncData) {
            return item.asyncData({ store, route: to });
          }
        })
      )
        .then(() => {
          // 停止加载指示器(loading indicator)
          loading.close();
          next();
        })
        .catch(next);
    });
    app.$mount('#app');
  });
}
