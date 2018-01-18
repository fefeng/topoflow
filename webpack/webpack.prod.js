const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = webpackMerge(commonConfig, {
    entry: {
        //main: './src/topoflow/index.js', // 程序入口        
        main: './demo/index.js', // 程序入口        
    },

    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: 'static/js/[name].[hash].[id].js',
        chunkFilename: 'static/js/[name].[hash].[id].js'
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                // 过滤 console
                // drop_console: true
            },
            sourceMap: true,
            mangle: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
});
