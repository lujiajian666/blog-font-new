import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ './views/Index.vue')
      },
      {
        path: '/article/:id',
        name: 'article',
        component: () => import(/* webpackChunkName: "article" */ './views/Article.vue')
      }
    ]
  });
}
