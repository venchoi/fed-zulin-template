import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import FedTable from '@/components/FedTable';
import { IStandardPriceAdjustmentItem, Status, IAdjustmentAddItem } from '@t/meter';
import { getStandardPriceAdjustment } from '@s/meter';
import { ColumnProps } from 'antd/lib/table';
import FedPagination from '@/components/FedPagination';

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
            title: '合同编号',
            width: 261,
            dataIndex: 'number',
            render: (text, record, index) => index + 1,
        },
        {
            title: '资产单元',
            dataIndex: 'start_date',
            width: 340,
        },
        {
            title: '租赁租期',
            dataIndex: 'price',
            width: 288,
        },
        {
            title: '经办人',
            width: 137,
            dataIndex: 'status',
        },
        {
            title: '状态',
            width: 100,
            dataIndex: 'created_on',
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
            <FedTable columns={columns} dataSource={dataSource} rowKey="id" scroll={{ y: 'calc(100vh - 820px)' }} />
        </>
    );
};
export default AdjustmentRecord;
