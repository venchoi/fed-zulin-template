// import '@babel/polyfill';
import React from 'react';
import dva from 'dva';
import { BrowserRouter } from 'dva/router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './app';
import model1 from './model/count';
import model2 from './model/list';
import './assets/init/normalize.css';
import './assets/less/index.less';
import createHistory from 'history/createBrowserHistory';
//@ts-ignore
import createLoading from 'dva-loading';
const app = dva({
    history: createHistory(),
});
app.use(createLoading());

app.model(model1);
app.model(model2);
app.router((obj: any) => (
    <BrowserRouter>
        <ConfigProvider locale={zhCN}>
            <App
                history={obj.history}
                match={obj.match}
                location={obj.localtion}
                getState={obj.app._store.getState}
                dispatch={obj.app._store.dispatch}
            />
        </ConfigProvider>
    </BrowserRouter>
));
app.start('#root');
