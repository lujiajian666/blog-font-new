<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
  * {
    padding: 0;
    margin: 0
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  // 自定义富文本样式
  .ql-syntax {
    padding: 15px;
    color: rgba(255, 255, 255, .8);
    font-size: 16px;
    line-height: 26px;
    background: rgba(0, 0, 0, .8);
    border-radius: 5px;
  }

  blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
  }

  .ql-align-center {
    text-align: center;
  }

  .index img {
    max-width: 100%;
  }

  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }

</style>
