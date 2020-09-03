import React from 'react';
import { Route, Switch } from 'dva/router';
import { RouteChildrenProps, Redirect } from 'react-router';
import OutlayList from './list';
import OutLayDetail from './detail';

const outlayRoutes = ({ match }: RouteChildrenProps) => {
    return (
        <Switch>
            <Route exact path={`${match?.path}/list`} component={OutlayList} />
            <Route exact path={`${match?.path}/detail/:id`} component={OutLayDetail} />
            <Redirect to={`${match?.path}/list`} />
        </Switch>
    );
};
export default outlayRoutes;
