import React from 'react';
import { Route, Switch, BrowserRouter, Redirect, RouteComponentProps } from 'dva/router';
import { Spin } from 'antd';
import Layout from './routers/layout';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader/root';
import { SubscriptionAPI } from 'dva';

function loading() {
    return <Spin />;
}
const routes = [
    {
        path: '/ui',
        component: Loadable({
            loader: () => import('./routers/ui'),
            loading,
        }),
    },
    {
        path: '/export/:stage_id/:type',
        component: Loadable({
            loader: () => import('./routers/export'),
            loading,
        }),
    },
    {
        path: '/report',
        component: Loadable({
            loader: () => import('./routers/report'),
            loading,
        }),
    },
    {
        path: '/derate',
        component: Loadable({
            loader: () => import('./routers/derate'),
            loading,
        }),
    },
    {
        path: '/noright',
        component: Loadable({
            loader: () => import('./routers/interceptors/noRights'),
            loading,
        }),
    },
    {
        path: '/404',
        component: Loadable({
            loader: () => import('./routers/interceptors/notFoundPage'),
            loading,
        }),
    },
];

class App extends React.PureComponent<RouteComponentProps & SubscriptionAPI> {
    public render() {
        return (
            <BrowserRouter basename="/middleground">
                <Layout dispatch={this.props.dispatch}>
                    {/* <Suspense fallback={<Spin size="large" tip="Loading..."></Spin>}> */}
                    <Switch>
                        {routes.map(item => {
                            return <Route path={item.path} component={item.component} key={item.path} />;
                        })}
                        <Redirect exact from="/*" to="/report?_smp=Rental.Report" />
                    </Switch>
                    {/* </Suspense> */}
                </Layout>
            </BrowserRouter>
        );
    }
}
export default hot(App);
