import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'dva/router';
import { Spin } from 'antd';
import Layout from './routers/layout';
import { RouteComponentProps } from 'dva/router';
import ReportList from './routers/report';
import Loadable from 'react-loadable';
//@ts-ignore
import { hot } from 'react-hot-loader';
interface Props extends RouteComponentProps {
    getState?: any;
    dispatch?: any;
}

function loading() {
    return <Spin />;
}
const routes = [
    {
        path: '/asset-holder/add',
        component: Loadable({
            loader: () => import('./routers/assetHolder/add'),
            loading,
        }),
    },
    {
        path: '/asset-holder/edit/:id',
        component: Loadable({
            loader: () => import('./routers/assetHolder/add'),
            loading,
        }),
    },
    {
        path: '/asset-holder/detail/:id',
        component: Loadable({
            loader: () => import('./routers/assetHolder/detail'),
            loading,
        }),
    },
    {
        path: '/asset-holder/list',
        component: Loadable({
            loader: () => import('./routers/assetHolder/index'),
            loading,
        }),
    },
    {
        path: '/asset-holder',
        component: Loadable({
            loader: () => import('./routers/assetHolder/index'),
            loading,
        }),
    },
    {
        path: '/ui',
        component: Loadable({
            loader: () => import('./routers/ui'),
            loading,
        }),
    },
    {
        path: '*/export-list/:type/:stage_id',
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
    // TODO children route
    {
        path: '/metermg/detail-adjust/:id',
        component: Loadable({
            loader: () => import('./routers/meter/adjustmentDetail'),
            loading: loading,
        }),
    },
    {
        path: '/metermg/detail-standard/:id',
        component: Loadable({
            loader: () => import('./routers/meter/standardDetail'),
            loading: loading,
        }),
    },
    {
        path: '/metermg',
        component: Loadable({
            loader: () => import('./routers/meter'),
            loading: loading,
        }),
    },
    {
        path: '/basicdata/customer',
        component: Loadable({
            loader: () => import('./routers/basicdata/customer'),
            loading: loading,
        }),
    },
    // {
    //     path: '/derate',
    //     component: Loadable({
    //         loader: () => import('./routers/derate'),
    //         loading: loading,
    //     }),
    //     // @ts-ignore
    //     // component: lazy(() => import('./routers/report')),
    // },
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

class App extends React.PureComponent<RouteComponentProps> {
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
export default hot(module)(App);
