import React from 'react';
import { Route, Switch, Router, BrowserRouter, Redirect } from 'dva/router';
import Home from './routers/home';
import Init from './routers/login';
import Layout from './routers/layout';
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
                            path="/init"
                            component={() => {
                                return <Init changeShowContent={() => {}} history={this.props.history} />;
                            }}
                        />
                        <Route
                            path="/home"
                            component={() => {
                                return <Home changeShowContent={() => {}} history={this.props.history} />;
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
                                return <Init changeShowContent={() => {}} history={this.props.history} />;
                            }}
                        />
                        <Redirect exact from="/*" to="/init?_smp=Rental.BillReminder" />
                    </Switch>
                </BrowserRouter>
            </Layout>
        );
    }
}
