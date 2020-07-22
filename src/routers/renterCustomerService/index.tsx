import React from 'react';
import { Route, Switch } from 'dva/router';
import { RouteChildrenProps, Redirect } from 'react-router';
import renterCustomerServiceIndex from './list';

export const renterCustomerServiceRoutes = ({ match }: RouteChildrenProps) => {
    return (
        <Switch>
            <Route exact path={`${match?.path}/list`} component={renterCustomerServiceIndex} />
            <Redirect to={`${match?.path}/list`} />
        </Switch>
    );
};
export default renterCustomerServiceRoutes;
