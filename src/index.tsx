// import '@babel/polyfill';
import React from 'react';
import dva from 'dva';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from './config';
import App from './app';
import mainModel from './model/main';
import './assets/init/normalize.css';
import './assets/less/index.less';
import { createBrowserHistory as createHistory } from 'history';
//@ts-ignore
import createLoading from 'dva-loading';

// sentry 测试服或生产
// process.env.NODE_ENV === 'production' &&
//     window?.Raven?.config(
//         config.TEST
//             ? 'https://813b813797634ef7a0d3884fb415cea3@sentry.myfuwu.com.cn/64'
//             : 'https://776429be7af64d219068e7acf74d6bbd@sentry.myfuwu.com.cn/65'
//     ).install();

import { AppContainer, setConfig } from 'react-hot-loader';
setConfig({
    ignoreSFC: true,
    //@ts-ignore
    ignoreClases: false,
    // optional
    disableHotRenderer: true,
    reloadHooks: false,
});
const app = dva({
    history: createHistory(),
});
app.use(createLoading());
app.model(mainModel);

function renderWithHotReload(C: any) {
    app.router((obj: any) => (
        <ConfigProvider locale={zhCN}>
            <AppContainer>
                <C
                    history={obj.history}
                    match={obj.match}
                    location={obj.location}
                    getState={obj.app._store.getState}
                    dispatch={obj.app._store.dispatch}
                />
            </AppContainer>
        </ConfigProvider>
    ));
    app.start('#root');
}

// /*热更新*/
// //@ts-ignore
// if (module.hot) {
//     //@ts-ignore
//     module.hot.accept(['./app'], () => {
//         const getRouter = require('./app').default;
//         renderWithHotReload(getRouter());
//     });
// }

renderWithHotReload(App);
