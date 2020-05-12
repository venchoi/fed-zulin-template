const merge = require('webpack-merge');
const base_config = require('./webpack.base.config');
const proxyConfig = require('./proxyConfig');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const dev_config = {
    mode: 'development',
    devServer: {
        contentBase: '/',
        open: true,
        port: 8808,
        hot: true,
        host: 'rental-dev.mysoft.com.cn',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: proxyConfig.target,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
        before(app) {
            app.get('/middleground/cookie/set', (req, res) => {
                const cookies = req.query
                for (const cookie in cookies) {
                    if (Object.prototype.hasOwnProperty.call(cookies, cookie)) {
                        res.cookie(cookie, cookies[cookie], {
                            httpOnly: true
                        })
                    }
                }
                res.redirect(
                    `${req.protocol}://${req.host}:${proxyConfig.serverPort}${
                        proxyConfig.baseAlias
                    }`
                )
            })
        },
        disableHostCheck: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //  new BundleAnalyzerPlugin()
    ],
};

module.exports = merge([base_config, dev_config]);
