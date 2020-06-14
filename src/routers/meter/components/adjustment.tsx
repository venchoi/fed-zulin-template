/**
 * 标准单价管理
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'dva/router';
import { Radio, Input, Button, Checkbox, Switch, message, Badge } from 'antd';
import { find, map, pick } from 'lodash';
import FedTable from '@c/FedTable';
import FedPagination from '@c/FedPagination';
import { ColumnProps } from 'antd/es/table';
import {
    IAdjustmentItem,
    IAdjustmentParams,
    IStatusItem,
    Status,
    PriceAdjustHandleType,
    IAdjustmentICURDParams,
} from '@t/meter';
import { getPriceAdjustmentList, postPrice } from '@s/meter';
import Item from 'antd/lib/list/Item';
import { Statistics, statusItem } from '../config';
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
        status: Status.ALL,
        keyword: '',
    });
    const [statistics, setStatistics] = useState<Record<Statistics, string>>({
        [Statistics.ALL]: '',
        [Statistics.AUDITED]: '',
        [Statistics.EFFECTED]: '',
        [Statistics.PENDING]: '',
        [Statistics.VOID]: '',
    });
    const columns: ColumnProps<IAdjustmentItem>[] = [
        {
            dataIndex: 'standard_name',
            title: '调整单',
        },
        {
            dataIndex: 'meter_type_name',
            title: '类型',
            width: 106,
        },
        {
            dataIndex: 'price',
            title: '调整后单价',
            width: 132,
        },
        {
            dataIndex: 'reason',
            title: '调整原因',
            ellipsis: true,
            // TODO tooltip
        },
        {
            dataIndex: 'status',
            title: '生效时间',
            width: 220,
        },
        {
            dataIndex: 'status',
            title: '状态',
            width: 90,
            render: (text: Status) => {
                return <Badge color={find(statusItem, ['title', text])?.color} text={text} />;
            },
        },
        {
            dataIndex: 'created_on',
            title: '提交时间',
        },
        {
            dataIndex: 'id',
            title: '操作',
            width: 163,
            render: (text, rowData) => {
                return (
                    <>
                        <Button
                            type="link"
                            onClick={() => actionHandler({ type: PriceAdjustHandleType.AUDIT, id: rowData.id })}
                            className="f-hidden meter-adjustment-audit"
                        >
                            审核
                        </Button>
                        <Button type="link" className="f-hidden meter-adjustment-view">
                            <Link to={`/meter/detail-adjust/${rowData.id}`}>详情</Link>
                        </Button>
                        <Button
                            type="link"
                            onClick={() => actionHandler({ type: PriceAdjustHandleType.VOID, id: rowData.id })}
                            className="f-hidden meter-adjustment-void"
                        >
                            作废
                        </Button>
                        <Button
                            type="link"
                            onClick={() => actionHandler({ type: PriceAdjustHandleType.CANCELAUDIT, id: rowData.id })}
                            className="f-hidden meter-adjustment-cancel-audit"
                        >
                            取消审核
                        </Button>
                    </>
                );
            },
        },
    ];

    const actionHandler = async (payload: IAdjustmentICURDParams) => {
        const { result } = await postPrice(payload);
        if (result) {
            message.success('操作成功');
            fetchList();
        }
    };
    const fetchList = async () => {
        const { data } = await getPriceAdjustmentList({ ...pageObj, ...params });
        setAdjustmentDataSource(data?.items || []);
        setTotal(data?.total || 0);
        const keys = map(statusItem, (item: { key: string }) => item.key);
        const values = pick(data, keys);
        setStatistics(values as Record<Statistics, string>);
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
                        value={params.status}
                        onChange={e => handleChangeParams('status', e.target.value)}
                    >
                        {statusItem.map(item => (
                            <RadioButton key={item.title} value={item.title}>
                                {item.title}
                                {+statistics[item.key] > 0 ? `·${statistics[item.key]}` : null}
                            </RadioButton>
                        ))}
                    </RadioGroup>
                    <Search
                        style={{ width: '312px' }}
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
