import React, { lazy, Suspense } from 'react';
import { Route, Switch, Router, BrowserRouter, Redirect } from 'dva/router';
import { Spin } from 'antd';
import Layout from './routers/layout';
import ReportList from './routers/report';
import NotFoundPage from './routers/interceptors/notFoundPage';
import Report from './routers/report';
import UI from './routers/ui';
import NoRights from './routers/interceptors/noRights';
import Export from './routers/export';

import { History } from 'history';
import { RouteComponentProps } from 'dva/router';
import Loadable from 'react-loadable';
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
        path: '/export/:stage_id/:type',
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

export default class App extends React.PureComponent<Props> {
    public render() {
        return (
            <Layout>
                <BrowserRouter basename="middleground">
                    <Router history={this.props.history}>
                        {/* <Suspense fallback={<Spin size="large" tip="Loading..."></Spin>}> */}
                        <Switch>
                            {routes.map(item => {
                                return <Route path={item.path} component={item.component} key={item.path} />;
                            })}
                            <Route
                                path="/"
                                component={() => {
                                    return <ReportList history={this.props.history} />;
                                }}
                            />
                            <Redirect exact from="/*" to="/report?_smp=Rental.Report" />
                        </Switch>
                    </Router>
                    {/* </Suspense> */}
                </BrowserRouter>
            </Layout>
        );
    }
}
