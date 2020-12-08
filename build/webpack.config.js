// webpack.config.js

const path = require('path')
// const Webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack')
const os = require('os')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const VueLoaderPlugin = require('vue-loader/dist/plugin').default
const devMode = process.argv.indexOf('--mode=production') === -1

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')], // 入口文件
  output: {
    filename: '[name].[contenthash:8].js', // 打包后的文件名称
    path: path.resolve(__dirname, '../dist'), // 打包后输出的文件所在的目录
    chunkFilename: 'js/[name]:[contenthash:8].js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, '../src'),
      'assets': path.resolve('src/assets'),
      'components': path.resolve('src/components')
    },
    extensions: ['*', '.js', '.json', '.vue']
  },
  externals: {
    // 这里写一些不想让webpack构建打包的静态资源
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'happypack/loader?id=happyBabel',
          // options: {
          //   presets: ['@babel/preset-env']
          // }
        }],
        include: [path.resolve(__dirname, '../src')],
        exclude: /node_modules/
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
        }],
        include: [path.resolve(__dirname, '../src')],
        exclude: /node_modules/
      },
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
                  name: 'img/[name].[contenthash:8].[ext]'
                }
              }
            }
          }
        ],
        exclude: /node_modules/
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
                  name: 'media/[name].[contenthash:8].[ext]'
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
                  name: 'fonts/[name].[contenthash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
    }),
    new VueLoaderPlugin(),
    new HappyPack({
      id: 'happyBabel', // 与loader对应的id标识
      loaders: [ // 用法和loader的配置一样，注意这里是loaders
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }] // 解决babel tree-shaking的坑
            ],
            cacheDirectory: true
          }
        }
      ],
      threadPool: happyThreadPool // 共享进程池
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../vendor-manifest.json')
    }),
    new CopyWebpackPlugin({ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
      patterns:
      [{
        from: 'static',
        to: 'static'
      }]
    })
  ]
}