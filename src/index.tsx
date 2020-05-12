// import '@babel/polyfill';
import React from 'react';
import dva from 'dva';
import { BrowserRouter } from 'dva/router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Cookie from 'js-cookie';
import App from './app';
import model1 from './model/count';
import model2 from './model/list';
import './assets/init/normalize.css';
import './assets/less/index.less';
import createHistory from 'history/createBrowserHistory';
//@ts-ignore
import createLoading from 'dva-loading';
const search = location && location.search;
//设置sid的cookie,并且进行跳转操作
if (search) {
    const arr = search.split('&');
    let pk;
    arr.forEach(item => {
        pk = item.split('=');
        //简易的处理一个 或者使用trim
        if (pk[0].trim() === 'sid') {
            Cookie.set(pk[0].trim(), pk[1], {
                expires: 1,
            });
        }
    });
}
const app = dva({
    history: createHistory(),
});
app.use(createLoading());

app.model(model1);
app.model(model2);
app.router((obj: any) => (
    <ConfigProvider locale={zhCN}>
        <App history={obj.history} getState={obj.app._store.getState} dispatch={obj.app._store.dispatch} />
    </ConfigProvider>
));
app.start('#root');
