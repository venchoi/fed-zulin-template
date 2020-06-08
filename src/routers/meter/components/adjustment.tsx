/**
 * 标准单价管理
 */
import React, { useState, useEffect } from 'react';
import { Radio, Input, Checkbox, Switch, message } from 'antd';
import FedTable from '@c/FedTable';
import FedPagination from '@c/FedPagination';
import { ColumnProps } from 'antd/es/table';
import { IAdjustmentItem, IAdjustmentParams, IMeterTypeItem } from '@t/meter';
import { getPriceAdjustmentList, postPriceEnabled } from '@s/meter';
// import Filter from './adjustmentFilter'

const { Group: RadioGroup, Button: RadioButton } = Radio;
const { Search } = Input;

const Adjustment = () => {
    const [adjustmentDataSource, setAdjustmentDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageObj, setPageObj] = useState({
        page: 1,
        page_size: 20,
    });
    const [params, setParams] = useState({
        meter_type_id: '',
        status: '',
        keyword: '',
    });
    const [meterTypeList, setMeterTypeList] = useState<IMeterTypeItem[]>([
        {
            meter_type_id: '1',
            value: '12',
            meter_type_name: '水表',
        },
        {
            meter_type_id: '1234',
            value: '182',
            meter_type_name: '电表',
        },
    ]);
    const columns: ColumnProps<IAdjustmentItem>[] = [
        {
            dataIndex: 'standard_name',
            title: '调整单',
        },
        {
            dataIndex: 'meter_type_name',
            title: '类型',
        },
        {
            dataIndex: 'price',
            title: '调整后单价',
        },
        {
            dataIndex: 'reason',
            title: '调整原因',
        },
        {
            dataIndex: 'status',
            title: '生效时间',
        },
        {
            dataIndex: 'status',
            title: '状态',
        },
        {
            dataIndex: 'created_on',
            title: '提交时间',
        },
        {
            dataIndex: 'id',
            title: '操作',
        },
    ];
    const handlePriceEnabled = async (rowData: IAdjustmentItem) => {
        const { result } = await postPriceEnabled({ id: rowData.id });
        if (result) {
            message.success('操作成功');
            fetchList();
        }
    };
    const fetchList = async () => {
        const { data } = await getPriceAdjustmentList({ ...pageObj, ...params });
        setAdjustmentDataSource(data?.items || []);
    };
    const handleChangeParams = <T extends keyof IAdjustmentParams>(key: T, value: IAdjustmentParams[T]) => {
        setParams(prvState => ({ ...prvState, ...{ [key]: value } }));
    };
    useEffect(() => {
        setPageObj({ ...pageObj, page_size: 1 });
    }, [params]);

    useEffect(() => {
        fetchList();
    }, [pageObj]);
    return (
        <>
            {/* TODO filter component */}
            <div className="filter">
                <div className="filter-left">
                    <RadioGroup
                        className="filter-item"
                        value={params.meter_type_id}
                        onChange={e => handleChangeParams('meter_type_id', e.target.value)}
                    >
                        {meterTypeList.map(item => (
                            <RadioButton key={item.meter_type_id} value={item.meter_type_id}>
                                {item.meter_type_name}
                                {+item.value > 0 ? `·${item.value}` : null}
                            </RadioButton>
                        ))}
                    </RadioGroup>
                    <Search
                        className="filter-item"
                        placeholder="名称、说明"
                        value={params.keyword}
                        onChange={e => handleChangeParams('keyword', e.target.value)}
                    />
                </div>
            </div>
            <FedTable columns={columns} dataSource={adjustmentDataSource} vsides />
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
};
export default Adjustment;
