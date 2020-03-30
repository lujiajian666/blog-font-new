var shareConfig = require('./common.js').shareConfig;
var webpConfig = {
  openPx2rem: true,
  proxy: {
    '/article': {
      target: process.env.HOST_ENV === 'dev' ? 'http://localhost:8888' : 'http://www.lujiajian.xyz',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        // '^/article': ''
      }
    }
  }
};
module.exports = { ...webpConfig, shareConfig };
