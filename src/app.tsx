import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'dva/router';
import { Spin } from 'antd';
import Layout from './routers/layout';
import { RouteComponentProps } from 'dva/router';
import ReportList from './routers/report';
import Loadable from 'react-loadable';
//@ts-ignore
import { hot } from 'react-hot-loader/root';
interface Props extends RouteComponentProps {
    getState?: any;
    dispatch?: any;
}

function loading() {
    return <Spin />;
}
const routes = [
    {
        path: '/ui',
        component: Loadable({
            loader: () => import('./routers/ui'),
            loading: loading,
        }),
    },
    {
        path: '*/export-list/:type/:stage_id',
        component: Loadable({
            loader: () => import('./routers/export'),
            loading: loading,
        }),
    },
    {
        path: '/report',
        component: Loadable({
            loader: () => import('./routers/report'),
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
            loading: loading,
        }),
    },
    {
        path: '/404',
        component: Loadable({
            loader: () => import('./routers/interceptors/notFoundPage'),
            loading: loading,
        }),
    },
];

class App extends React.PureComponent<Props> {
    public render() {
        return (
            <Layout>
                <BrowserRouter basename="/middleground">
                    {/* <Suspense fallback={<Spin size="large" tip="Loading..."></Spin>}> */}
                    <Switch>
                        {routes.map(item => {
                            return <Route path={item.path} component={item.component} key={item.path} />;
                        })}
                        {/* <Route
                            path="/"
                            component={() => {
                                return <ReportList history={this.props.history} />;
                            }}
                        /> */}
                        <Redirect exact from="/*" to="/report?_smp=Rental.Report" />
                    </Switch>
                    {/* </Suspense> */}
                </BrowserRouter>
            </Layout>
        );
    }
}
export default hot(App);
