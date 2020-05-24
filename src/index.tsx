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

const app = dva({
    history: createHistory(),
});
app.use(createLoading());
app.model(model1);
app.model(model2);
app.router((obj: any) => (
    <ConfigProvider locale={zhCN}>
        <App
            history={obj.history}
            match={obj.match}
            location={obj.location}
            getState={obj.app._store.getState}
            dispatch={obj.app._store.dispatch}
        />
    </ConfigProvider>
));
app.start('#root');
