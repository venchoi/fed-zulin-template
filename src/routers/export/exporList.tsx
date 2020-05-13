import React, { useState } from 'react';
import { Card, Input, Select } from 'antd';
import FedTable from '@c/FedTable';
import FedPagination from '@c/FedPagination';

// types
import { ColumnProps } from 'antd/es/table';
import ExportItemType, { ExportListParams } from '@t/exportTypes';

const { Search } = Input;
const { Option } = Select;

const exportCard = () => {
    const [dataSource, setDataSource] = useState([]);
    const [params, setParams] = useState({
        status: '',
        page: 1,
        page_size: 20,
        keyword: '',
        start_date: '',
        end_date: '',
    });
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

    const options = [
        {
            value: '',
            name: '全部状态',
        },
        {
            value: '成功',
            name: '成功',
        },
        {
            value: '失败',
            name: '失败',
        },
        {
            value: '导出中',
            name: '导出中',
        },
    ];

    return (
        <Card>
            <div className="filter">
                <div className="filter-left">
                    <span className="filter-item">
                        <Search placeholder="操作人" style={{ width: '224px' }} value={params.keyword} />
                    </span>
                    <span className="filter-item">
                        <Select
                            onChange={() => {}}
                            placeholder="全部状态"
                            value={params.status}
                            style={{ width: '144px' }}
                        >
                            {options.map(item => {
                                return (
                                    <Option key={item.value} value={item.value}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </span>
                </div>
            </div>
            <FedTable<ExportItemType> dataSource={dataSource} columns={columns} />
            <FedPagination />
        </Card>
    );
};
export default exportCard;
