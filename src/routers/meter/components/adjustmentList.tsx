/**
 * 调整单管理
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'dva/router';
import { Radio, Input, Button, Checkbox, Switch, message, Badge, Space, Popconfirm } from 'antd';
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
import PriceItem from './price';
import moment from 'moment';
import { MeterTracker } from '@/track';
// import Filter from './adjustmentFilter'

const { Group: RadioGroup, Button: RadioButton } = Radio;
const { Search } = Input;
interface IProps {
    refresh: boolean;
}
const Adjustment = (props: IProps) => {
    const { refresh } = props;
    const [loading, setLoading] = useState(true);
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
            width: 200,
            render: (text, rowData) => {
                return (
                    <>
                        <div>{text}</div>
                        <div style={{ color: '#959799', fontSize: '12px' }}>{rowData.code}</div>
                    </>
                );
            },
        },
        {
            dataIndex: 'meter_type_name',
            title: '类型',
        },
        {
            dataIndex: 'price',
            title: '调整后单价',
            align: 'right',
            width: 220,
            render: (text, rowData) => {
                const { is_step, price, unit, step_data } = rowData;
                // @ts-ignore
                let stepArr: IStepData[] = step_data;
                return <PriceItem {...rowData} step_data={stepArr} />;
            },
        },
        {
            dataIndex: 'reason',
            title: '调整原因',
            ellipsis: true,
            // TODO tooltip
        },
        {
            dataIndex: 'start_date',
            title: '生效时间',
            width: 220,
            render: text => {
                return <>{moment(text).format('YYYY-MM-DD')}</>;
            },
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
                    <Space>
                        {[Status.PENDING].includes(rowData.status) ? (
                            <Popconfirm title="确认审核该调整单？" onConfirm={() => actionHandler({ type: PriceAdjustHandleType.AUDIT, id: rowData.id })}>
                                <Button type="link" data-event={MeterTracker['meter-adjustment-audit']} className="f-hidden meter-adjustment-audit">
                                    审核
                                </Button>
                            </Popconfirm>
                        ) : null}
                        <Button type="link" data-event={MeterTracker['meter-adjustment-view']}  className="f-hidden meter-adjustment-view">
                            <Link to={`/metermg/detail-adjust/${rowData.id}`}>详情</Link>
                        </Button>
                        {[Status.PENDING].includes(rowData.status) ? (
                            <Popconfirm title="确认作废该调整单？" onConfirm={() => actionHandler({ type: PriceAdjustHandleType.VOID, id: rowData.id })}>
                                <Button type="link" data-event={MeterTracker['meter-adjustment-void']} className="f-hidden meter-adjustment-void">
                                    作废
                                </Button>
                            </Popconfirm>
                        ) : null}
                        {[Status.AUDITED].includes(rowData.status) ? (
                            <Popconfirm title="确认取消审核该调整单？" onConfirm={() => actionHandler({ type: PriceAdjustHandleType.CANCELAUDIT, id: rowData.id })}>
                                <Button type="link" data-event={MeterTracker['meter-adjustment-cancel-audit']} className="f-hidden meter-adjustment-cancel-audit">
                                    取消审核
                                </Button>
                            </Popconfirm>
                        ) : null}
                    </Space>
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
        setLoading(true);
        const { data } = await getPriceAdjustmentList({ ...pageObj, ...params });
        setLoading(false);
        const result = (data?.items || []).map((item: IAdjustmentItem) => {
            item.step_data = item.step_data ? JSON.parse(item.step_data) : [];
            return item;
        });
        setAdjustmentDataSource(result || []);
        setTotal(data?.total || 0);
        const keys = map(statusItem, (item: { key: string }) => item.key);
        const values = pick(data, keys);
        setStatistics(values as Record<Statistics, string>);
    };
    const handleChangeParams = <T extends keyof IAdjustmentParams>(key: T, value: IAdjustmentParams[T]) => {
        setParams(prvState => ({ ...prvState, ...{ [key]: value } }));
    };
    useEffect(() => {
        setPageObj({ ...pageObj, page: 1 });
    }, [params]);

    useEffect(() => {
        fetchList();
    }, [pageObj, refresh]);
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
                            <RadioButton key={item.title} value={item.value}>
                                {item.title}
                                {+statistics[item.key] > 0 ? `·${statistics[item.key]}` : null}
                            </RadioButton>
                        ))}
                    </RadioGroup>
                    <Search
                        style={{ width: '312px' }}
                        placeholder="名称、说明、调整单编号"
                        value={params.keyword}
                        onChange={e => handleChangeParams('keyword', e.target.value)}
                    />
                </div>
            </div>
            <FedTable<IAdjustmentItem>
                loading={loading}
                columns={columns}
                dataSource={adjustmentDataSource}
                vsides
                rowKey="id"
                scroll={{ y: 'calc(100vh - 354px)' }}
            />
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