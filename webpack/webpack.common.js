const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    disable: process.env.NODE_ENV === 'development',
    filename: 'static/css/[name].[hash].[id].css'
});


function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {

    devtool: 'cheap-module-eval-source-map',

    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: 'js/[name].[hash].[id].js',
        chunkFilename: 'js/[name].[hash].[id].js'
    },

    resolve: {
        extensions: ['.js', '.vue', '.json'],        
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }],
                fallback: 'style-loader'
            }),
            exclude: /node_modules/
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader',
            options: {
                name: 'static/fonts/[name]-[hash].[ext]'
            }
        }]
    },

    plugins: [
        extractSass,
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     filename: 'static/js/[name].[hash].[id].js'
        // }),
        new webpack.NoEmitOnErrorsPlugin(), //  允许中断不终止程序
        new webpack.HotModuleReplacementPlugin(), //  代码热替换
        new HtmlWebpackPlugin({ //  将webpack生成的文件在html中引用
            filename: 'index.html', //  文件路径
            template: './index.html', //  文件模板
            minify: {
                removeComments: true, //  移除HTML中的注释
                collapseWhitespace: true //  删除空白符与换行符
            }
        })
    ],
};