interface Config {
    iconSymbolUrl: string;
    DEV: boolean;
    apiDomain: string;
    serverPort: number;
    baseAlias: string;
}

const config: Config = {
    iconSymbolUrl: '//at.alicdn.com/t/font_1786298_sl67g94rj9g.js',
    DEV: process.env.NODE_ENV !== 'production',
    apiDomain: '/api', //代理请求前缀
    serverPort: 8807,
    baseAlias: '/middleground',
};

export default config;
