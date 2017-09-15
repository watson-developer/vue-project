const path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
console.log(htmlWebpackPlugin)
module.exports = {
    entry: {
        app: ['./src/main.js'],
        vendor: [
            'lodash',
            'axios',
            'vue',
            'vue-router'
        ]
    },
    output: {
        path: path.resolve(__dirname , '../dist'),
        publicPath: '/dist',
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            //转化ES6语法
            {
                test: /\.js$/,
                use: 'babel',
                /*以上为简写
                use: [
                  {
                    loader: 'babel'
                  }
                  //or
                  'babel'
                ],*/
                exclude: /node_modules/
            },
            //解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue',
                options: {
                    loaders:{
                        css: extractTextPlugin.extract({
                            fallback: 'vue-style-loader',
                            use: 'css-loader'
                        })
                    }
                }
            },
            //图片转化，小于8K自动转化为base64的编码
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url',
                options: {
                    limit: 8192
                }
            }
        ]
    },
    //禁止显示webpack的build.js太大的提示
    performance: {
        hints: false
    },
    stats: {
        maxModules: 0,
        // chunks:false,
        // modules: false,
        // chunkModules: false,
        children: false
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new extractTextPlugin({
            filename: 'style.[hash].css',
            allChunks: true
        }),
        new htmlWebpackPlugin({
            title:'SPA',
            template:'template/index.template.html',
            filename: 'index_bundle.html'
        })
    ],
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    resolve: {
        // require时省略的扩展名，如：require('app') 不需要app.js
        extensions: ['.js', '.vue'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            components: path.join(__dirname, './src/components')
        }
    }
}
