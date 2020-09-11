import React from 'react';
import { Route, Switch } from 'dva/router';
import { RouteChildrenProps, Redirect } from 'react-router';
import AdviceCollection from './adviceCollection';

const derateRoutes = ({ match }: RouteChildrenProps) => {
    return (
        <Switch>
            <Route exact path={`${match?.path}/adviceCollection`} component={AdviceCollection} />
            <Redirect to={`${match?.path}/adviceCollection`} />
        </Switch>
    );
};
export default derateRoutes;
