import React, { useState } from 'react';
import { Card, Button } from 'antd';
import Adjustment from './components/adjustment';
import Standard from './components/standard';
import EditModal from './components/standardEditModal';

import './index.less';

const List = () => {
    const [activeTabKey, setActiveTabKey] = useState('standard');
    const [addModalVisible, setAddModalVisible] = useState(false);
    const tabList = [
        {
            key: 'standard',
            tab: '标准单价管理',
        },
        {
            key: 'adjustment',
            tab: '单价调整单',
        },
    ];
    const extra = (
        <>
            <Button type="primary" onClick={() => setAddModalVisible(true)}>
                新建标准
            </Button>
        </>
    );
    return (
        <>
            <div className="layout-list meter-list">
                <Card
                    className="report-card"
                    title="水电单价管理"
                    tabList={tabList}
                    extra={extra}
                    tabProps={{
                        size: 'default',
                    }}
                    activeTabKey={activeTabKey}
                    onTabChange={key => {
                        setActiveTabKey(key);
                    }}
                >
                    <div className={`tabpane-container ${activeTabKey === 'adjustment' ? 'hidden' : 'visible'}`}>
                        <Standard />
                    </div>
                    <div className={`tabpane-container ${activeTabKey === 'adjustment' ? 'visible' : 'hidden'}`}>
                        <Adjustment />
                    </div>
                </Card>
            </div>
            {addModalVisible ? (
                <EditModal onCancel={() => setAddModalVisible(false)} onOk={() => setAddModalVisible(false)} />
            ) : null}
        </>
    );
};
export default List;
