import React, { useState, useEffect } from 'react';
import { Badge, Button, Select, Statistic } from 'antd';
import { find } from 'lodash';
import { Link } from 'dva/router';
import FedTable from '@/components/FedTable';
import { IStandardPriceAdjustmentItem, Status } from '@t/meter';
import { getStandardPriceAdjustment } from '@s/meter';
import { ColumnProps } from 'antd/lib/table';
import { statusItem, Statistics } from '../config';
import AdjustmentChart from './adjustmentTimeLine';

const { Option } = Select;

const AdjustmentRecord = ({ id = '' }) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(Status.ALL);
    const [total, setTotal] = useState(0);
    const [pageObj, setPageObj] = useState({
        page: 1,
        page_size: 20,
    });
    const columns: ColumnProps<IStandardPriceAdjustmentItem>[] = [
        {
            title: '序号',
            width: 65,
            dataIndex: 'number',
            render: (text, record, index) => index + 1,
            align: 'center',
        },
        {
            title: '生效时间',
            dataIndex: 'start_date',
            render: (text, rowData) => {
                return (
                    <>
                        {text}
                        {rowData.end_date ? ` 至 ${rowData.end_date}` : ''}
                    </>
                );
            },
        },
        {
            title: '调整单价',
            dataIndex: 'price',
            render: (text, rowData) => {
                return (
                    <>
                        {text}
                        {rowData.unit}/月
                    </>
                );
            },
        },
        {
            title: '状态',
            dataIndex: 'number',
            render: (text: Status) => {
                return <Badge color={find(statusItem, ['title', text])?.color} text={text} />;
            },
        },
        {
            title: '提交时间',
            dataIndex: 'created_on',
        },
        {
            title: '操作',
            dataIndex: 'id',
            render: (text, rowData) => {
                return (
                    <>
                        <Link to={`/metermg/detail-adjust/${rowData.id}`}>调整详情</Link>
                    </>
                );
            },
        },
    ];
    const fetchList = async () => {
        const { data } = await getStandardPriceAdjustment({ ...pageObj, meter_standard_price_id: id });
        setDataSource(data?.items || []);
        setTotal(data?.total || 0);
    };
    useEffect(() => {
        fetchList();
    }, [pageObj]);
    return (
        <>
            <div>
                {dataSource.length > 0 ? <AdjustmentChart id={id} /> : null}
                <Select
                    style={{ width: '176px' }}
                    value={selectedStatus}
                    onChange={(value: Status) => setSelectedStatus(value)}
                >
                    {statusItem.map(item => (
                        <Option key={item.key} value={item.key}>
                            {item.title}
                        </Option>
                    ))}
                </Select>
            </div>
            <FedTable columns={columns} dataSource={dataSource} rowKey="id" />
        </>
    );
};
export default AdjustmentRecord;
