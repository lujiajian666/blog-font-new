var shareConfig = require('./common.js').shareConfig;
var webpConfig = {
  openPx2rem: true,
  proxy: {
    '/article': {
      target: 'http://www.lujiajian.xyz',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        // '^/article': ''
      }
    }
  }
};
module.exports = { ...webpConfig, shareConfig };
