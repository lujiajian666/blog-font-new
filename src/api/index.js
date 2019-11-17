import {
  get
} from '../service/axios';
function listArticles (extParams) {
  const params = {
    currentPage: 1,
    pageSize: 10
  }
  Object.assign(params, extParams);

  return get('/article/get', params).then(res => {
    return {
      tableData: res.data.list,
      total: res.data.total,
      currentPage: res.data.currentPage
    }
  })
}
function fetchArticle () {

}
export { listArticles, fetchArticle }