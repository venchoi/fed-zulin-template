import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'dva/router';
import './index.less';
import { Button, Card, PageHeader } from 'antd';
import qs from 'querystring';
import EditModal from '@/routers/meter/components/standardEditModal';

const Detail = ({ location }: RouteComponentProps) => {
    const [activeTabKey, setActiveTabKey] = useState('standard');
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [refreshStanderList, setRefreshStanderList] = useState(false); // 刷新标准单价列表
    const [refreshAdjustList, setRefreshAdjustList] = useState(false); // 刷新单价调整列表
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
                新增持有人
            </Button>
        </>
    );

    const adjustOKCB = (result: boolean) => {
        if (result) {
            setRefreshAdjustList(prev => !prev);
        }
    };
    useEffect(() => {
        const query = location.search.replace('?', '');
        const parseQuery = qs.parse(query);
        setActiveTabKey(parseQuery.tab as string);
    }, [location]);
    return (
        <>
            <PageHeader title="导出记录" ghost={false} />
            <div className="layout-list meter-list">持有人Table 列表信息</div>
            {addModalVisible ? (
                <EditModal
                    onCancel={() => setAddModalVisible(false)}
                    onOk={() => {
                        setAddModalVisible(false);
                        setRefreshStanderList(prev => !prev);
                    }}
                />
            ) : null}
        </>
    );
};
export default Detail;
