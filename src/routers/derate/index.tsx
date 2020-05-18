import React from 'react';
import { Route, Switch } from 'dva/router';
import { RouteChildrenProps } from 'react-router';
import DerateList from './list';

const derateRoutes = ({ match }: RouteChildrenProps) => {
    return (
        <Switch>
            <Route exact path={`${match?.path}/list`} component={DerateList} />
        </Switch>
    );
};
export default derateRoutes;
