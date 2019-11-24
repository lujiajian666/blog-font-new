const config = require('./webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const resolve = function(str) {
  return path.resolve(__dirname, str);
};
const publicPath = '/';
const webpackConfig = {
  entry: {
    index: resolve('../src/app.js')
  },
  output: {
    path: resolve('../dist'),
    filename: `static/js/[name].[hash:8].js`,
    publicPath
  },
  resolve: {
    alias: {
      views: resolve('src/views'),
      assets: resolve('src/assets/'),
      components: resolve('src/components/'),
      config: resolve('config/'),
      public: resolve('public/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(vue)$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: false
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                'component',
                {
                  libraryName: 'element-ui',
                  styleLibraryName: 'theme-chalk'
                }
              ],
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 2
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              name: 'static/img/[name].[hash:8].[ext]',
              publicPath: '/'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/font/[name].[hash:8].[ext]',
          publicPath: '/'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        HOST_ENV: JSON.stringify(process.env.HOST_ENV)
      }
    }),
    new VueLoaderPlugin(),
    // new HtmlWebpackPlugin({
    //   template: resolve('../public/index.html'),
    //   filename: 'index.html',
    //   inject: true,
    //   title: config.shareConfig.title,
    //   desc: config.shareConfig.desc,
    //   baseUrl: publicPath
    // }),
    new CopyWebpackPlugin([
      {
        from: 'public',
        to: 'static'
      }
    ]),
    // new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    host: '127.0.0.1',
    port: 8080,
    proxy: config.proxy,
    open: true,
    publicPath: '/',
    compress: true,
    // 不检查host(allowedHosts设置白名单)
    disableHostCheck: true,
    // 错误显示
    overlay: { warnings: false, errors: true }
  },
  devtool: 'cheap-source-map'
};

module.exports = webpackConfig;
