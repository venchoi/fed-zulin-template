/**
 * 单价调整单详情页 —— 调整记录
 */
import React, { useState, useEffect } from 'react';
import { Badge, Button, Select, Statistic, Space } from 'antd';
import { find } from 'lodash';
import { Link } from 'dva/router';
import FedTable from '@/components/FedTable';
import { IStandardPriceAdjustmentItem, Status, IAdjustmentAddItem } from '@t/meter';
import { getStandardPriceAdjustment } from '@s/meter';
import { ColumnProps } from 'antd/lib/table';
import { statusItem, Statistics } from '../config';
import AdjustmentChart from './adjustmentTimeLine';
import PriceItem from './price';
import FedDataSection from '@c/FedDataSection';
import FedPagination from '@/components/FedPagination';
import moment from 'moment';

const { Option } = Select;

const AdjustmentRecord = ({ id = '' }) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(Status.ALL);
    const [total, setTotal] = useState(0);
    const [pageObj, setPageObj] = useState({
        page: 1,
        page_size: 20,
    });
    const filter = [
        {
            title: '全部记录', // 只有全部是需要单独写文案，全部的参数是'' ，展示是全部
            value: Status.ALL,
        },
        {
            title: Status.EFFECTED, // 只有全部是需要单独写文案，全部的参数是'' ，展示是全部
            value: Status.EFFECTED,
        },
        {
            title: Status.AUDITED, // 只有全部是需要单独写文案，全部的参数是'' ，展示是全部
            value: Status.AUDITED,
        },
    ];
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
                        {moment(text).format('YYYY-MM-DD')}
                        {rowData.end_date ? ` 至 ${moment(rowData.end_date).format('YYYY-MM-DD')}` : ''}
                    </>
                );
            },
        },
        {
            title: '调整单价',
            dataIndex: 'price',
            align: 'right',
            render: (text, rowData) => {
                const { is_step, price, unit, step_data } = rowData;
                // @ts-ignore
                let stepArr: IStepData[] = step_data;
                return <PriceItem {...rowData} step_data={stepArr} />;
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
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
        const { data } = await getStandardPriceAdjustment({
            ...pageObj,
            meter_standard_price_id: id,
            status: selectedStatus,
        });
        const result = (data?.items || []).map((item: IAdjustmentAddItem) => {
            item.step_data = item.step_data ? JSON.parse(item.step_data) : [];
            return item;
        });
        setDataSource(result);
        setTotal(+data?.total || 0);
    };
    useEffect(() => {
        fetchList();
    }, [pageObj, selectedStatus]);
    const recordContent = (
        <>
            <Select
                style={{ width: '176px', marginBottom: '16px' }}
                value={selectedStatus}
                onChange={(value: Status) => setSelectedStatus(value)}
            >
                {filter.map(item => (
                    <Option key={item.value} value={item.value}>
                        {item.title}
                    </Option>
                ))}
            </Select>
            {/* 719 */}
            <FedTable columns={columns} dataSource={dataSource} rowKey="id" scroll={{ y: 'calc(100vh - 820px)' }} />
            <FedPagination
                onShowSizeChange={(current, page_size) => {
                    setPageObj({ page: 1, page_size });
                }}
                onChange={(page, page_size) => {
                    setPageObj({ page, page_size: page_size || 20 });
                }}
                current={pageObj.page_size}
                pageSize={pageObj.page_size}
                showTotal={total => `共${Math.ceil(+total / +(pageObj.page_size || 1))}页， ${total}条记录`}
                total={+total}
            />
        </>
    );
    return (
        <>
            <FedDataSection section={{ title: '单价变动折线图', content: <AdjustmentChart id={id} /> }} />
            <FedDataSection section={{ title: '调整记录', content: recordContent }} />
        </>
    );
};
export default AdjustmentRecord;
