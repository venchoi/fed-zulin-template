import React, { lazy, Suspense } from 'react';
import { Route, Switch, Router, BrowserRouter, Redirect } from 'dva/router';
import { Spin } from 'antd';
import Layout from './routers/layout';
import ReportList from './routers/report';
import NotFoundPage from './routers/interceptors/notFoundPage';
import { History } from 'history';
import { RouteComponentProps } from 'dva/router';
interface Props extends RouteComponentProps {
    getState?: any;
    dispatch?: any;
}

const routes = [
    {
        path: '/ui',
        // @ts-ignore
        component: lazy(() => import('./routers/ui')),
    },
    {
        path: '/export/:type/:stageId',
        // @ts-ignore
        component: lazy(() => import('./routers/export')),
    },
    {
        path: '/report',
        // @ts-ignore
        component: lazy(() => import('./routers/report')),
    },
    {
        path: '/noright',
        // @ts-ignore
        component: lazy(() => import('./routers/interceptors/noRights')),
    },
    {
        path: '/404',
        // @ts-ignore
        component: lazy(() => import('./routers/interceptors/notFoundPage')),
    },
];

export default class App extends React.PureComponent<Props> {
    public render() {
        return (
            <Layout>
                <BrowserRouter basename="middleground">
                    <Suspense fallback={<Spin size="large" tip="Loading..."></Spin>}>
                        <Switch>
                            {routes.map(item => {
                                return <Route path={item.path} component={item.component} />;
                            })}
                            <Route
                                path="/"
                                component={() => {
                                    return <ReportList history={this.props.history} />;
                                }}
                            />
                            <Redirect exact from="/*" to="/report?_smp=Rental.Report" />
                        </Switch>
                    </Suspense>
                </BrowserRouter>
            </Layout>
        );
    }
}
