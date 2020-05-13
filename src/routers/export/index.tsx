import React from 'react';
import { RouteComponentProps } from 'dva/router';

interface Props extends RouteComponentProps {}

const exportList = ({ match: { params: historyParams } }: Props) => {
    console.log(historyParams);
    return <div>234</div>;
};
export default exportList;
