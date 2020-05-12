import React, { Fragment } from 'react';
import { Route, Switch, Router, Redirect } from 'dva/router';
import Home from './routers/home';
import Init from './routers/login';
import Layout from './routers/layout';
import NoRights from './routers/interceptors/noRights';
import NotFoundPage from './routers/interceptors/notFoundPage';
import { RouteComponentProps } from 'dva/router';
interface Props extends RouteComponentProps {
    getState: any;
    dispatch: any;
}
export default class App extends React.PureComponent<Props> {
    public render() {
        return (
            <Layout>
                <Router history={this.props.history}>
                    <Switch>
                        <Route
                            path="/init"
                            component={() => {
                                return <Init history={this.props.history} />;
                            }}
                        />
                        <Route
                            path="/home"
                            component={() => {
                                return <Home history={this.props.history} />;
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
                                return <Init history={this.props.history} />;
                            }}
                        />
                        <Redirect exact from="/*" to="/init?_smp=Rental.BillReminder" />
                    </Switch>
                </Router>
            </Layout>
        );
    }
}
