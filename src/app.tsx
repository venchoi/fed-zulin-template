import React from 'react';
import { Route, Switch, Router, Redirect } from 'dva/router';
import UI from './routers/ui';
import Layout from './routers/layout';
import ReportList from './routers/report';
import { History } from 'history';
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
                            path="/"
                            component={() => {
                                return <ReportList history={this.props.history} />;
                            }}
                        />
                        <Redirect exact from="/*" to="/init?_smp=Rental.BillReminder" />
                    </Switch>
                </Router>
            </Layout>
        );
    }
}
