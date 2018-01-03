const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    entry: {
        // main: './src/topoflow/index.js', // 程序入口        
        main: './src/index.js', // 程序入口        
    },

    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: 'js/[name].[hash].[id].js',
        chunkFilename: 'js/[name].[hash].[id].js'
    },
});
