const merge = require('webpack-merge');
// const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config.js');
const VueSSRServerPlugin = require('vue-server-renderer/client-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isPro = process.env.HOST_ENV === 'pro';
const path = require('path');
module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: path.resolve(__dirname, '../src/entry-client.js'),
  // 对 bundle renderer 提供 source map 支持
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: Infinity
    }
  },
  module: {
    rules: [
      {
        test: /.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
                require('postcss-pxtorem')({
                  rootValue: 37.5,
                  propList: ['*']
                })
              ]
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  // 这是将服务器的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-server-bundle.json`
  plugins: [
    new CleanWebpackPlugin(),
    new VueSSRServerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash:8].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }
    })
  ]
});
