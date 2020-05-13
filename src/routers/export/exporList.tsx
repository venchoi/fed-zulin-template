import React, { useState } from 'react';
import { Card, Input } from 'antd';
import FedTable from '@c/FedTable';

// types
import { ColumnProps } from 'antd/es/table';
import ExportItemType from '@t/exportTypes';

const { Search } = Input;

const exportList = () => {
    const [dataSource, setDataSource] = useState([]);
    const columns: ColumnProps<ExportItemType>[] = [
        {
            dataIndex: 'created_on',
            title: '导出时间',
        },
        {
            dataIndex: 'created_by',
            title: '导出人',
        },
        {
            dataIndex: 'status',
            title: '状态',
        },
        {
            dataIndex: 'id',
            title: '操作',
            render: () => {
                return <></>;
            },
        },
    ];

    return (
        <Card>
            <div className="filter"></div>
            <FedTable<ExportItemType> dataSource={dataSource} columns={columns} />
        </Card>
    );
};
export default exportList;
