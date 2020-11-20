// webpack.config.js

const path = require('path')
// const Webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/dist/plugin').default
const devMode = process.argv.indexOf('--mode=production') === -1

module.exports = {
  // mode: 'development', // 开发模式
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')], // 入口文件
  output: {
    filename: '[name].[hash:8].js', // 打包后的文件名称
    path: path.resolve(__dirname, '../dist'), // 打包后输出的文件所在的目录
    chunkFilename: 'js/[name]:[hash:8].js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.json', '.vue']
  },
  // devServer: {
  //   port: 3000,
  //   hot: true,
  //   contentBase: '../dist'
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
        {
          loader: devMode ? 'vue-style-loader': MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../dist/css/',
            hmr: devMode
          }
        },
        'css-loader', 
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'autoprefixer'
                ]
              ]
            }
          }
        }] // 从右向左解析
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: devMode ? 'vue-style-loader': MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: devMode
            }
          },
          'css-loader',
          {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'autoprefixer'
                ]
              ]
            }
          }
        }, 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/i, // 图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options:{
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        }]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new VueLoaderPlugin(),
    // new Webpack.HotModuleReplacementPlugin()
  ]
}