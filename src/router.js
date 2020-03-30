import Vue from 'vue';
import Router from 'vue-router';
const isPro = process.env.HOST_ENV === 'pro';
const prefix = isPro ? '/blog' : ''
Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: prefix + '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ './views/index/Index.vue')
      },
      {
        path: prefix + '/article/:id',
        name: 'article',
        component: () => import(/* webpackChunkName: "article" */ './views/Article.vue')
      }
    ]
  });
}
