const express = require('express');
const server = express();
const { createBundleRenderer } = require('vue-server-renderer');
const config = require('../config/common');
const path = require('path');
const isPro = process.env.HOST_ENV === 'pro'
console.log('nodejs环境: ' + process.env.HOST_ENV)
const renderer = createBundleRenderer(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'), {
  runInNewContext: false, // 推荐
  template: require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8'),
  clientManifest: require('../dist/vue-ssr-client-manifest.json')
});

server.use(isPro ? '/blog/static' : '/static', function(req, res, next){
  console.log('请求静态资源'+ req.path);
  next();
},express.static(path.resolve(__dirname, '../dist/static')))

server.get('*', (req, res) => {
  console.log('请求页面:' + req.url)
  const context = { 
    flexjs: isPro ? '/blog/static/flexible.js' : '/static/flexible.js',
    url: req.url,
    title: config.shareConfig.title,
    desc: config.shareConfig.desc
  };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found');
      } else {
        console.log(err)
        res.status(500).end('Internal Server Error');
      }
    } else {
      res.end(html);
    }
  });
});

server.listen(8088, _ => {
  console.log('开始运行')
})
