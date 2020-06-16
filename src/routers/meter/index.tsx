import React, { useState } from 'react';
import { Card, Button } from 'antd';
import Adjustment from './components/adjustmentList';
import Standard from './components/standardList';
import EditModal from './components/standardEditModal';

import './index.less';

const List = () => {
    const [activeTabKey, setActiveTabKey] = useState('standard');
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [refreshStanderList, setRefreshStanderList] = useState(false); // 刷新标准单价列表
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
            <Button type="primary" onClick={() => setAddModalVisible(true)} className="f-hidden meter-standard-add">
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
                        <Standard refresh={refreshStanderList} />
                    </div>
                    <div className={`tabpane-container ${activeTabKey === 'adjustment' ? 'visible' : 'hidden'}`}>
                        <Adjustment />
                    </div>
                </Card>
            </div>
            {addModalVisible ? (
                <EditModal
                    onCancel={() => setAddModalVisible(false)}
                    onOk={() => {
                        setAddModalVisible(false);
                        setRefreshStanderList(true);
                    }}
                />
            ) : null}
        </>
    );
};
export default List;
