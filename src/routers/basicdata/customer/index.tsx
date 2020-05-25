import React, { useState } from 'react';
import { History } from 'history';
import { Card, Button } from 'antd';

interface IProps {
    history: History;
}
const customerManagement = (props: IProps) => {

    return (
        <div className="report layout-list">
            <Card
                className="report-card"
                title="客户管理"
                tabProps={{
                    size: 'default',
                }}
            >

            </Card>
        </div>
    );
};

export default customerManagement
