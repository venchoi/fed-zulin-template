import React from 'react';
import { Route, Switch } from 'dva/router';
import { History } from 'history';
import './index.less';
interface Props {
    readonly history: History;
}
class CookieSet extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return <div>cookie set page</div>;
    }
}
export default CookieSet;
