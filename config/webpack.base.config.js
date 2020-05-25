const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const hardSourcePlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const antOverride = require('../src/vendor/antd');

module.exports = {
    entry: {
        app: ['react-hot-loader/patch', '@babel/polyfill', path.resolve(__dirname, '../src/index.tsx')],
        vendor: ['react', 'react-dom'],
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.ts(x?)$/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    exclude: ['node_modules'],
                                    //jsx语法
                                    presets: [
                                        [
                                            '@babel/preset-env',
                                            {
                                                modules: false,
                                                useBuiltIns: 'entry',
                                                corejs: 2, // 这里需要注意：是根据你的版本来写
                                            },
                                        ],
                                    ],
                                    cacheDirectory: true,
                                    plugins: [
                                        'react-hot-loader/babel',
                                        'lodash',
                                        '@babel/plugin-transform-runtime',
                                        //支持import 懒加载
                                        '@babel/plugin-syntax-dynamic-import',
                                        [
                                            'import',
                                            {
                                                libraryName: 'antd',
                                                libraryDirectory: 'es',
                                                style: true, // or 'css'
                                            },
                                            'antd',
                                        ],
                                        [
                                            'import',
                                            {
                                                libraryName: 'ykj-ui',
                                                libraryDirectory: 'es/components',
                                            },
                                            'ykj-ui',
                                        ],
                                    ],
                                },
                            },
                            {
                                loader: 'awesome-typescript-loader',
                            },
                            {
                                loader: 'thread-loader',
                                // 有同样配置的 loader 会共享一个 worker 池(worker pool)
                                options: {
                                    // 产生的 worker 的数量，默认是 cpu 的核心数
                                    workers: 4,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(less|css)$/,
                        use: [
                            { loader: 'style-loader' },
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                },
                            },
                            {
                                loader: 'postcss-loader',
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    javascriptEnabled: true,
                                    modifyVars: {
                                        hack: `true; @import "${path.resolve(
                                            __dirname,
                                            '../src/assets/less/antd/index.less'
                                        )}";`,
                                    },
                                    // modifyVars: antOverride,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(png|jpg|jpeg|gif|svg)$/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 1024 * 1,
                                    outputPath: '/',
                                    name: '[name].[hash:5].[ext]',
                                    esModule: false,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            // favicon: path.resolve(__dirname, '../src/assets/img/favicon.ico'),
        }),
        new hardSourcePlugin(),
        new webpack.NamedModulesPlugin(),
        new LodashModuleReplacementPlugin({ shorthands: true }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@c': path.resolve(__dirname, '../src/components'),
            '@m': path.resolve(__dirname, '../src/model'),
            '@s': path.resolve(__dirname, '../src/services'),
            '@t': path.resolve(__dirname, '../src/types'),
        },
    },
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks: 'all',
        },
    },
};
