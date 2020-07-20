interface Config {
    iconSymbolUrl: string;
    DEV: boolean;
    TEST: boolean;
    apiDomain: string;
    serverPort: number;
    baseAlias: string;
}

const config: Config = {
    iconSymbolUrl: '//at.alicdn.com/t/font_1786298_c4nd70v5t8e.js',
    DEV: process.env.NODE_ENV !== 'production', // 开发环境
    TEST: window.location.hostname.indexOf('test') !== -1, //测试环境
    apiDomain: '/api', //代理请求前缀
    serverPort: 8807,
    baseAlias: '/middleground',
};

export default config;
