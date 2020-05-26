interface Config {
    iconSymbolUrl: string;
    DEV: boolean;
    TEST: boolean;
    apiDomain: string;
    serverPort: number;
}

const config: Config = {
    iconSymbolUrl: '//at.alicdn.com/t/font_1786298_sl67g94rj9g.js',
    DEV: process.env.NODE_ENV !== 'production', // 开发环境
    TEST: window.location.hostname.indexOf('test') !== -1, //测试环境
    apiDomain: '/api', //代理请求前缀
    serverPort: 8807,
};

export default config;
