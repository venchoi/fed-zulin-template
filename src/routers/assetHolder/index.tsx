import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'dva/router';
import './index.less';
import { Button, Card, PageHeader } from 'antd';
import qs from 'querystring';
import { exportConfig } from '@/routers/export/exportConfig';

const List = ({ location }: RouteComponentProps) => {
    const [activeTabKey, setActiveTabKey] = useState('standard');
    const [addModalVisible, setAddModalVisible] = useState(false);

    useEffect(() => {
        const query = location.search.replace('?', '');
        const parseQuery = qs.parse(query);
        setActiveTabKey(parseQuery.tab as string);
    }, [location]);
    return (
        <>
            <PageHeader title="导出记录" ghost={false} />
            <div className="layout-list meter-list">持有人Table 列表信息</div>
        </>
    );
};
export default List;
