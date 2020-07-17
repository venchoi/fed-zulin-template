import React from 'react';
import { Card } from 'antd';

import Filter from './components/Filter';
import List from './components/List';
import TopRightFunc from './components/topRightFunc';

const OutlayList = () => {
    return (
        <div className="outlay">
            <Card title="收支管理">
                <TopRightFunc></TopRightFunc>
                <Filter></Filter>
                <List></List>
            </Card>
        </div>
    );
};

export default OutlayList;
