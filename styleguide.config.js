module.exports = {
    webpackConfig: require('./config/webpack.dev.config.js'),
    pagePerSection: true,
    sections: [{
      name: 'UI Components',
      components: 'src/components/**/*.{js,jsx,ts,tsx}',
    }, {
      name: 'helpers',
      components: 'src/helper/**/*.{js,jsx,ts,tsx}',
    }],
    showUsage: true,
    showCode: true,
    title: '云空间通用组件'
  }
