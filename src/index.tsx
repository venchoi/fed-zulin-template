// import '@babel/polyfill';
import React from 'react';
import dva from 'dva';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from './config';
import App from './app';
import model1 from './model/count';
import model2 from './model/list';
import './assets/init/normalize.css';
import './assets/less/index.less';
import createHistory from 'history/createBrowserHistory';
//@ts-ignore
import createLoading from 'dva-loading';

// sentry 测试服或生产
// process.env.NODE_ENV === 'production' &&
//     window?.Raven?.config(
//         config.TEST
//             ? 'https://813b813797634ef7a0d3884fb415cea3@sentry.myfuwu.com.cn/64'
//             : 'https://776429be7af64d219068e7acf74d6bbd@sentry.myfuwu.com.cn/65'
//     ).install();

//@ts-ignore
import { AppContainer, setConfig } from 'react-hot-loader';
setConfig({
    ignoreSFC: true,
    //@ts-ignore
    ignoreClases: true,
    // optional
    disableHotRenderer: true,
});
const app = dva({
    history: createHistory(),
});
app.use(createLoading());
app.model(model1);
app.model(model2);
const render = (Component: any) => {
    app.router((obj: any) => (
        <ConfigProvider locale={zhCN}>
            <Component
                history={obj.history}
                match={obj.match}
                location={obj.location}
                getState={obj.app._store.getState}
                dispatch={obj.app._store.dispatch}
            />
        </ConfigProvider>
    ));
    app.start('#root');
};
render(App);

//@ts-ignore
if (module.hot) {
    //@ts-ignore
    module.hot.accept('./app.tsx', () => {
        //因为在App里使用的是export default语法，这里使用的是require,默认不会加载default的，所以需要手动加上
        const NextApp = require('./app.tsx').default;
        // 重新渲染到 document 里面
        render(NextApp);
    });
}
