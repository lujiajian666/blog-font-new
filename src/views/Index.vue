<template>
  <div class="index">
    <div class="container">
      <div class="nav">
        <div class="search">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search"
          size="small" @change="searchData">
          </el-input>
        </div>
      </div>

      <ul>
        <router-link tag="li" :to="{name: 'article', params: {id: item.id}}" v-for="(item, index) in tableData" :key="index">
          {{item.createTime}} » {{item.title}}
        </router-link>
      </ul>
      <div class="footer">
        <el-pagination layout="prev, pager, next" :total="total" background :page-size="pageSize"
          :current-page.sync="currentPage" @current-change="listArticle"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    get
  } from '../service/axios';
  export default {
    data() {
      return {
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        search: ''
      }
    },
    created() {
      this.listArticle()
    },
    methods: {
      listArticle(extParams) {
        const params = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        Object.assign(params, extParams);
        get('/article/get', params).then(res => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
        })
      },
      searchData() {
        this.currentPage = 1;
        this.listArticle({key: this.search})
      }
    },
    computed: {
      totalPage() {
        const totalPage = Math.ceil(this.total / this.pageSize);
        console.log(totalPage)
        return totalPage;
      }
    },
    watch: {
      currentPage(curr) {
        console.log(this.currentPage)
      }
    }
  }

</script>

<style lang="less" scoped>
  .index {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: url('../assets/bg.jpg') no-repeat fixed center center;
    justify-content: center;
    align-items: center;

    .container {
      position: relative;
      min-width: 70%;
      min-height: 80%;
      padding: 20px;
      color: white;
      background: rgba(0, 0, 0, .5);

      .nav {
        height: 40px;
        line-height: 40px;
        .search {
          width: 200px;
          float: right;
        }
      }

      .footer {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
      }
    }

    ul {
      text-align: left;

      li {
        padding-left: 20px;
        margin: 10px auto;
        font-size: 18px;
        list-style: none;
        cursor: pointer;
        background: #f5deb382;
        border-radius: 10px;
      }
    }

    .page-no {}
  }

</style>
