import React, { useState } from 'react';
import { Card } from 'antd';
import { getReportHref } from '../../helper/commonUtils';

// types
import { ColumnProps } from 'antd/es/table';
import IRecordType from './types';

import './index.less';
import MyReportList from './components/MyReportList';
import StandReportList from './components/StandReportList';
import { History } from 'history';
interface Props {
    history: History;
}
const ReportList = (props: Props) => {
    const [activeTabKey, setActiveTabKey] = useState('myreport');

    const tabList = [
        {
            key: 'myreport',
            tab: '我的报表',
        },
        {
            key: 'basicreport',
            tab: '标准报表库',
        },
    ];

    const columns: ColumnProps<IRecordType>[] = [
        {
            dataIndex: 'name',
            title: '报表名称',
            render: (text, record, index) => {
                if (activeTabKey === 'myreport') {
                    //新增
                    return (
                        <span>
                            <a href={getReportHref({ id: record.id })} target="_blank" title={record.name}>
                                {record.name}
                            </a>
                            {!record.standard_id ? (
                                <span className="tag custom-report-tag" title="自定义报表">
                                    自
                                </span>
                            ) : (
                                ''
                            )}
                        </span>
                    );
                }
                return <>{text || '-'}</>;
            },
        },
        {
            dataIndex: 'rds_type',
            title: '报表类型',
            width: 162,
            render: (text, record, index) => {
                return <>{record.rds_type === 'rds_dm' ? 'DM数据源' : '租户数据源'}</>;
            },
        },
        {
            dataIndex: 'desc',
            title: '报表说明',
            width: 232,
            render: text => {
                return <>{text || '-'}</>;
            },
        },
        {
            dataIndex: 'upload_by',
            title: '上传人',
            width: 112,
            render: text => {
                return <>{text || '-'}</>;
            },
        },
        {
            dataIndex: 'upload_on',
            title: '上传时间 ',
            width: 162,
            render: text => {
                return <>{text || '-'}</>;
            },
        },
    ];

    return (
        <div className="report layout-list">
            <Card
                className="report-card"
                title="统计报表"
                tabList={tabList}
                tabProps={{
                    size: 'default',
                }}
                activeTabKey={activeTabKey}
                onTabChange={key => {
                    setActiveTabKey(key);
                }}
            >
                <div style={{ display: `${activeTabKey === 'myreport' ? 'block' : 'none'}`, height: '100%' }}>
                    <MyReportList columns={columns} setActiveTabKey={setActiveTabKey} />
                </div>
                <div style={{ display: `${activeTabKey === 'myreport' ? 'none' : 'block'}`, height: '100%' }}>
                    <StandReportList columns={columns} />
                </div>
            </Card>
        </div>
    );
};

export default ReportList;
