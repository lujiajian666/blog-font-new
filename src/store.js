import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { fetchArticle, listArticles } from './api';

export function createStore() {
  return new Vuex.Store({
    state: {
      article: {},
      tableData: [],
      total: 0,
      currentPage: 1
    },
    mutations: {
      setArticle(state, { id, item }) {
        state.article[id] = item;
      },
      setPageMessage(state, val) {
        ({ 
          tableData: state.tableData, 
          total: state.total,
          currentPage: state.currentPage 
        } = val)
      }
    },
    actions: {
      fetchArticle({ commit }, id) {
        // `store.dispatch()` 会返回 Promise，
        // 以便我们能够知道数据在何时更新
        return fetchArticle(id).then(item => {
          commit('setArticle', { id, item });
        });
      },
      listArticles({ commit }, params = {}) {
        return listArticles(params).then(data => {
          commit('setPageMessage', data)
        })
      }
    }
  });
}
