import React from 'react';
import { Route, Switch, Router, BrowserRouter, Redirect } from 'dva/router';
// import dynamic from 'dva/dynamic'
import UI from './routers/ui';
import Layout from './routers/layout';
import ReportList from './routers/report';
import NoRights from './routers/interceptors/noRights';
import NotFoundPage from './routers/interceptors/notFoundPage';
import { History } from 'history';
interface Props {
    history?: any;
    getState?: any;
    dispatch?: any;
}
export default class App extends React.PureComponent<Props> {
    public render() {
        return (
            <Layout>
                <BrowserRouter basename="middleground">
                    <Switch>
                        <Route
                            path="/ui"
                            component={() => {
                                return <UI />;
                            }}
                        />
                        <Route
                            path="/report"
                            component={() => {
                                return <ReportList history={this.props.history} />;
                            }}
                        />
                        <Route
                            path="/report/:type"
                            component={() => {
                                return <ReportList history={this.props.history} />;
                            }}
                        />
                        <Route
                            path="/noright"
                            component={() => {
                                return <NoRights history={this.props.history} />;
                            }}
                        />
                        <Route path="/404" component={NotFoundPage} />
                        <Route
                            path="/"
                            component={() => {
                                return <ReportList history={this.props.history} />;
                            }}
                        />
                        <Redirect exact from="/*" to="/report?_smp=Rental.Reort" />
                    </Switch>
                </BrowserRouter>
            </Layout>
        );
    }
}
