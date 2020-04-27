interface Config {
    iconSymbolUrl: string;
    DEV: boolean;
    apiDomain: string;
    serverPort: number;
}

const config: Config = {
    iconSymbolUrl: '//at.alicdn.com/t/font_1786298_8hhzc9s5zwu.js',
    DEV: process.env.NODE_ENV !== 'production',
    apiDomain: '/api', //代理请求前缀
    serverPort: 8808,
};

export default config;
