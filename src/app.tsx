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
    return <div>loading</div>;
}
const routes = [
    {
        path: '/ui',
        // component: UI,
        component: Loadable({
            loader: () => import('./routers/ui'),
            loading: loading,
        }),

        // component: lazy(() => import('./routers/ui')),
    },
    {
        path: '/export/:stage_id/:type',
        component: Export,
        // @ts-ignore
        // component: lazy(() => import('./routers/export')),
    },
    {
        path: '/report',
        component: Report,
        // @ts-ignore
        // component: lazy(() => import('./routers/report')),
    },
    {
        path: '/derate',
        component: Loadable({
            loader: () => import('./routers/derate'),
            loading: loading,
        }),
        // @ts-ignore
        // component: lazy(() => import('./routers/report')),
    },
    {
        path: '/noright',
        component: NoRights,
        // @ts-ignore
        // component: lazy(() => import('./routers/interceptors/noRights')),
    },
    {
        path: '/404',
        component: NotFoundPage,
        // @ts-ignore
        // component: lazy(() => import('./routers/interceptors/notFoundPage')),
    },
];

export default class App extends React.PureComponent<Props> {
    public render() {
        return (
            <Layout>
                <BrowserRouter basename="/middleground">
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
                    {/* </Suspense> */}
                </BrowserRouter>
            </Layout>
        );
    }
}
