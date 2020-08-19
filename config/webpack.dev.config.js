const merge = require('webpack-merge');
const base_config = require('./webpack.base.config');
const proxyConfig = require('./proxyConfig');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const { argv } = require('yargs');
// 本地开发环境配置，默认 rental 环境
const env = argv.env || 'rental';
const config = proxyConfig[env];
console.log(config)
const dev_config = {
    mode: 'development',
    devServer: {
        contentBase: '/',
        open: true,
        port: config.port,
        hot: true,
        https: true,
        host: 'rental-dev.myfuwu.com.cn',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: config.target,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
            // 增加 本地附件上传代理设置
            '/auth': {
                target: config.target,
                changeOrigin: true,
            },
        },
        disableHostCheck: true,
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        //  new BundleAnalyzerPlugin()
    ],
};

module.exports = merge([base_config, dev_config]);
