var shareConfig = require('./common.js').shareConfig;
var webpConfig = {
  openPx2rem: true,
  proxy: {
    '/api': {
      target: 'http://gamecard.quickcan.cn',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': ''
      }
    }
  }
};
module.exports = { ...webpConfig, shareConfig };
