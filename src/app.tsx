import React from 'react';
import { Route, Switch, Router, Redirect } from 'dva/router';
import Home from './routers/home';
import Init from './routers/login';
import Layout from './routers/layout';

interface Props {
    history?: any;
    getState?: any;
    dispatch?: any;
}
export default class App extends React.PureComponent<Props> {
    public render() {
        return (
            <Layout changeShowContent={() => {}} history={this.props.history}>
                <Router history={this.props.history}>
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
                            path="/"
                            component={() => {
                                return <Init changeShowContent={() => {}} history={this.props.history} />;
                            }}
                        />
                        <Redirect exact from="/*" to="/init?_smp=Rental.BillReminder" />
                    </Switch>
                </Router>
            </Layout>
        );
    }
}
