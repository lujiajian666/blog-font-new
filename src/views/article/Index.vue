<template>
  <div>
    <p class="tag">
      <img data-v-52b17e8b="" src="../../assets/zhishen.jpg" class="logo">
      Lu Jiajian的个人博客
      <span class="tags" v-for="(value, index) in tags" :key="index">{{ types[value] }}</span>
    </p>
    <div class="index" id="articlePage" :class="{ white: tableData.markdown_name }" v-if="tableData">
      <div class="container ql-snow">
        <div v-if="!tableData.markdown_name" class="inner ql-editor">
          <h1>{{ tableData.title }}</h1>
          <p class="time">{{ tableData.createTime }}</p>
          <div v-html="tableData.text"></div>
        </div>
        <div v-else>
          <h1>{{ tableData.title }}</h1>
         <iframe id="md-iframe" @load='iframeOnload' width="100%" frameborder="no" border="0" ref="iframe" style="height: 700px" :src="'//www.lujiajian.xyz/html/markdown-show/?name=' + tableData.markdown_name"></iframe>
        </div>
        <div class="comment-text-area">
          <textarea v-model="comment"></textarea>
          <input type="button" value="发表" @click="addComment()" />
          <input v-if="username" type="button" class="logout" value="退出登录" @click="logout()" />
          <input v-else type="button" class="login" value="登录" @click="login()" />
        </div>
        <ul class="comment">
          <li v-for="(item, index) in parentComment" :key="index">
            <span>
              {{
              item.username === tableData.username ? "作者" : item.username
              }}：
            </span>
            <span>{{ item.content }}</span>
            <template v-if="replyId === item.id">
              <br />
              <input v-model="replyText" />
              <span class="reply pointer cancel" @click="cancelReply(item.id)">取消</span>
            </template>
            <span class="reply pointer" @click="reply(item.id)" v-if="item.username !== username">回复</span>
            <ul>
              <li v-for="(item2, index2) in item.list" :key="index2">
                <span>
                  {{
                  item2.username === tableData.username
                  ? "作者"
                  : item2.username
                  }}
                  回复
                  {{
                  item2.to === tableData.username ? "作者" : item2.to
                  }}：
                </span>
                <span>{{ item2.content }}</span>
                <template v-if="replyId === item2.id">
                  <br />
                  <input v-model="replyText" />
                  <span class="reply pointer cancel" @click="cancelReply(item2.id)">取消</span>
                </template>
                <span class="reply pointer" @click="reply(item2.id)" v-if="item2.username !== username">回复</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="background" id="particlarjs"></div> -->
    <login-component v-if="showLogin"></login-component>
  </div>
</template>

<script>
  import {
    get,
    post
  } from '../../service/axios';
  import Vue from 'vue';
  import cookie from 'js-cookie';
  // //登录组件
  import loginComponent from '../../components/login/index';
  export default {
    components: {
      loginComponent
    },
    data() {
      return {
        username: cookie.get('username'),
        types: null,
        showLogin: false,
        comment: '',
        replyText: '',
        replyId: null,
        //所有评论
        allComment: null,
        //所有父级评论
        parentComment: null
      }
    },
    asyncData({
      store,
      route
    }) {
      return store.dispatch('fetchArticle', route.params.id)
    },
    created() {
      Vue.use(loginComponent);
      get('/article/type/get', {
        currentPage: 1,
        pageSize: 100
      }).then(_ => {
        this.types = _.data.list.reduce((total, item) => {
          total[item.id] = item.name;
          return total;
        }, {});
      }).catch(e => {
        console.log(e)
      })
      this.getComment();
    },
    computed: {
      tags() {
        if (this.types) {
          return this.tableData.types.split(';').filter(item => !!item);
        }
      },
      tableData() {
        return this.$store.state.article[this.$route.params.id]
      }
    },
    methods: {
      iframeOnload () {
        // 动态获取iframe高度
        const iframeDom = this.$refs.iframe;
        const iframeDocument = iframeDom.contentWindow.document;
        const height = iframeDocument.documentElement.scrollHeight || iframeDocument.body.scrollHeight;
        console.log('iframe onload!', height)
        iframeDom.style.height = height + 'px';
      },
      addComment(id) {
        let loading = null;
        if (!id && this.comment === '' || id && this.replyText === '') {
          this.$message.warning('请输入内容')
          return;
        }
        return this.$login.checkLogin('#articlePage').then(_ => {
          loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          const data = {
            content: this.comment,
            parentId: '',
            articleId: this.$route.params.id
          };
          if (id) {
            data.parentId = id;
            data.content = this.replyText;
          }
          return post('/article/comment/add', data);
        }).then(ret => {
          loading.close();
          this.$message.success('发布成功');
          this.comment = '';
          this.getComment();
        }).catch(err => {
          loading && loading.close();
          this.$message.error(err.message)
        })
      },
      reply(id) {
        if (this.replyId !== id) {
          this.replyId = id;
        } else {
          this.addComment(id).then(_ => {
            this.replyId = null;
          })
        }
      },
      cancelReply(id) {
        this.replyId = null;
      },
      getComment() {
        get('/article/comment/get', {
          id: this.$route.params.id
        }).then(res => {
          this.allComment = res.data;
        }).then(_ => {
          //排列评论
          const sequence = [];
          const parent = this.allComment.filter(item => item.parent_id === 0).reduce((total, item) => {
            item.list = [];
            total[item.id] = item;
            sequence.push({
              id: item.id,
              username: item.username,
              parent: item.id
            })
            return total;
          }, {})
          this.allComment.filter(item => item.parent_id !== 0).sort((a, b) => a.create_at < b.create_at ? -1 : 1)
            .forEach(
              item => {
                sequence.some(item2 => {
                  if (item.parent_id === item2.id) {
                    // 1.增加to属性，方便渲染
                    // 2.加到对应的父级comment的list里面方便渲染
                    // 3.自己放到sequence里面，并且parent标记为顶级parent，方便三四五等等级comment找到父级comment
                    item.to = item2.username;
                    parent[item2.parent]['list'].push(item);
                    sequence.push({
                      id: item.id,
                      username: item.username,
                      parent: item2.parent
                    });
                    return true;
                  } else {
                    return false;
                  }
                })
              })
          this.parentComment = parent;
          console.log(this.parentComment)
        }).catch(e => {
          console.log(e)
        })
      },
      logout() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let date = new Date();
        date.setTime(-1000);
        document.cookie = `username='';path=/;expires=${date.toUTCString()}`;
        this.username = null;
        loading.close();
      },
      login() {
        this.$login.checkLogin('#articlePage')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import './index.less';
</style>