<template>
  <div class="index">
    <div class="nav">
      <div class="logo-box">
        <img src="../../assets/zhishen.jpg" class="logo">
        <span class="title">Lu Jiajian的个人博客</span>
      </div>
      <div class="search">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search" size="small" @change="searchData">
        </el-input>
      </div>
    </div>

    <div class="content">
      <div class="left">
        <h4>分类</h4>
        <ul>
          <li :class="{ active: typeIndex === index }" v-for="(item, index) in types" :key="index" @click="searchDataByType(item.id, index)">{{ item.name }}（{{ item.count }}）</li>
        </ul>
      </div>
      <div class="right">
        <ul>
          <router-link tag="li" :to="{name: 'article', params: {id: item.id}}" v-for="(item, index) in tableData"
            :key="index">
            <div class="inner">
              <div class="text">{{item.title}}</div>
              <span class="time">{{item.createTime}}</span>
            </div>
            <div class="rotate"></div>
            <div class="rotate-mask"></div>
          </router-link>
        </ul>
        <div class="footer">
          <el-pagination class="el-pagination is-background" layout="prev, pager, next" :total="total" background
            :page-size="10" :current-page.sync="currentPage" @current-change="listArticle"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    get
  } from '../../service/axios';
  export default {
    data() {
      return {
        search: '',
        types: [],
        typeIndex: 0,
      }
    },
    asyncData({
      store,
      route
    }) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('listArticles')
    },
    created() {
      get('/article/countByType').then(_ => {
        let total = 0;
        _.list.forEach(item => {
          total += item.count;
          this.types.push(item);
        })
        this.types.unshift({ name: '全部', count: total });
      }).catch(e => {
        console.log(e)
      })
    },
    computed: {
      totalPage() {
        const totalPage = Math.ceil(this.total / 10);
        return totalPage;
      },
      tableData() {
        return this.$store.state.tableData
      },
      total() {
        return this.$store.state.total
      },
      currentPage: {
        get() {
          return this.$store.state.currentPage
        },
        set(val) {
          this.$store.state.currentPage = val;
        }
      }
    },
    methods: {
      listArticle() {
        const searchParams = {
          currentPage: this.currentPage
        }
        if (this.search) {
          searchParams.key = this.search
        } else if (this.typeId) {
          searchParams.type = this.typeId
        }
        this.$store.dispatch('listArticles', searchParams)
      },
      searchDataByType(typeId, index) {
        this.cleanOtherSearch();
        this.typeIndex = index;
        if (typeId !== undefined) { 
          this.typeId = typeId;
        }
        this.listArticle();
      },
      searchData() {
        const key = this.search;
        this.cleanOtherSearch();
        this.search = key;
        this.listArticle();
      },
      cleanOtherSearch () {
        this.currentPage = 1;
        this.typeIndex = 0;
        this.typeId = undefined;
        this.search = '';
      }
    }
  }
</script>

<style lang="less" scoped>
  @import './index.less';
</style>