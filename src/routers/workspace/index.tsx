import React from 'react';
import { Route, Switch } from 'dva/router';
import { RouteChildrenProps, Redirect } from 'react-router';
import WorkspaceIndexPage from './list';

const derateRoutes = ({ match }: RouteChildrenProps) => {
    return (
        <Switch>
            <Route exact path={`${match?.path}/index`} component={WorkspaceIndexPage} />
            <Redirect to={`${match?.path}/index`} />
        </Switch>
    );
};
export default derateRoutes;
