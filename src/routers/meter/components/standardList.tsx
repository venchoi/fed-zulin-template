/**
 * 标准单价管理 —— 列表tab
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'dva/router';
import { Radio, Input, Checkbox, Switch, message, Button, Dropdown, Menu, Space, Modal } from 'antd';
import { sumBy, omit } from 'lodash';
import FedTable from '@c/FedTable';
import FedPagination from '@c/FedPagination';
import { ColumnProps } from 'antd/es/table';
import {
    IStandardPriceItem,
    IStandardPriceParams,
    IStatisticsItem,
    IMeterTypeStatisticItem,
    StandardHandleType,
    IAdjustmentItem,
    IStepData,
} from '@t/meter';
import { ENABLE } from '@t/common';
import { getStandardPriceList, postStandardPrice } from '@s/meter';
import EditStandardModal from './standardEditModal';
import EditAdjustmentModal from './adjustmentEditModal';
import { MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import PriceItem from './price';
import moment from 'moment';
import { MeterTracker } from '@/track';
// import Filter from './adjustmentFilter'

const { Group: RadioGroup, Button: RadioButton } = Radio;
const { Search } = Input;

interface IProps {
    refresh: boolean;
    adjustOk: (result: boolean) => void;
}

const Standard = (props: IProps) => {
    const { refresh, adjustOk } = props;
    const [loading, setLoading] = useState(true);
    const [standardDataSource, setStandardDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageObj, setPageObj] = useState({
        page: 1,
        page_size: 20,
    });
    const [addStandardVisible, setAddStandardVisible] = useState(false);
    const [addAdjustmentVisible, setAddAdjustmentVisible] = useState(false);
    const [editItem, setEditItem] = useState({}); // IStandardPriceItem | IAdjustmentItem
    const [params, setParams] = useState({
        meter_type_id: '',
        is_enabled: '',
        keyword: '',
    });
    const [statisticsInfo, setStatisticsInfo] = useState<IStatisticsItem[]>([
        {
            id: '',
            num: '',
            value: '全部',
        },
        {
            id: '',
            num: '',
            value: '水表(系统)',
        },
        {
            id: '',
            num: '',
            value: '电表(系统)',
        },
        {
            id: '',
            num: '',
            value: '燃气表(系统)',
        },
    ]);
    const columns: ColumnProps<IStandardPriceItem>[] = [
        {
            dataIndex: 'name',
            title: '名称',
        },
        {
            dataIndex: 'meter_type_name',
            title: '类型',
        },
        {
            dataIndex: 'price',
            title: '单价',
            width: 220,
            align: 'right',
            render: (text, rowData) => {
                const { is_step, price, unit, step_data } = rowData;
                // @ts-ignore
                let stepArr: IStepData[] = step_data;
                return <PriceItem {...rowData} step_data={stepArr} />;
            },
        },
        {
            dataIndex: 'remark',
            title: '说明',
            ellipsis: true,
        },
        {
            dataIndex: 'effect_date',
            title: '生效时间',
            width: 220,
            render: (text, rowData) => {
                return <>{moment(text).format('YYYY-MM-DD')}</>;
            },
        },
        {
            dataIndex: 'is_enabled',
            title: '是否启用',
            width: 90,
            render: (text, rowData) => {
                return <Switch checked={!!+text} onChange={e => handlePriceEnabled(rowData)} />;
            },
        },
        {
            dataIndex: 'id',
            title: '操作',
            width: 163,
            render: (text, rowData) => {
                return (
                    <Space>
                        <Button
                            type="link"
                            data-event={MeterTracker['meter-adjustment-add']}
                            onClick={() => handleEditPrice(rowData)}
                            className="f-hidden meter-adjustment-add"
                        >
                            调整价格
                        </Button>
                        <Button
                            type="link"
                            data-event={MeterTracker['meter-standard-view']}
                            className="f-hidden meter-standard-view"
                        >
                            <Link to={`/metermg/detail-standard/${rowData.id}`}>详情</Link>
                        </Button>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item>
                                        <Button
                                            type="link"
                                            data-event={MeterTracker['meter-standard-edit']}
                                            onClick={() => handleEdit(rowData)}
                                            className="f-hidden meter-standard-edit"
                                        >
                                            编辑
                                        </Button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Button
                                            type="link"
                                            data-event={MeterTracker['meter-standard-delete']}
                                            onClick={() => handleDelete(rowData)}
                                            className="f-hidden meter-standard-delete"
                                        >
                                            删除
                                        </Button>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            {/* TODO color  primary  */}
                            <MoreOutlined rotate={90} style={{ color: '#0D86FF' }} />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];
    const handleEditPrice = (rowData: IStandardPriceItem) => {
        setEditItem(rowData);
        setAddAdjustmentVisible(true);
    };
    const handleEdit = (rowData: IStandardPriceItem) => {
        setEditItem(rowData);
        setAddStandardVisible(true);
    };

    const handleDelete = (rowData: IStandardPriceItem) => {
        Modal.confirm({
            title: '确认删除该标准单价？',
            content: '删除后不可撤回',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const { result } = await postStandardPrice({ type: StandardHandleType.DELETE, id: rowData.id });
                if (result) {
                    message.success('操作成功');
                    fetchList();
                }
            },
        });
    };

    const handlePriceEnabled = async (rowData: IStandardPriceItem) => {
        const { result } = await postStandardPrice({ type: StandardHandleType.ENABLED, id: rowData.id });
        if (result) {
            message.success('操作成功');
            fetchList();
        }
    };
    const fetchList = async () => {
        const apiParams: Partial<IStandardPriceParams> = omit(params, ['is_enabled']);
        params.is_enabled === ENABLE.ENABLED && (apiParams.is_enabled = params.is_enabled);
        setLoading(true);
        const { data } = await getStandardPriceList({ ...pageObj, ...apiParams });
        setLoading(false);
        const result = (data?.items || []).map((item: IStandardPriceItem) => {
            item.step_data = item.step_data ? JSON.parse(item.step_data) : [];
            return item;
        });
        setStandardDataSource(result);
        setTotal(data?.total || 0);
        const statistics = data?.statistics_info || [];
        const sum = sumBy(statistics, (item: IStatisticsItem) => +item.num);
        setStatisticsInfo(
            [
                {
                    id: '',
                    num: sum,
                    value: '全部',
                },
            ].concat(statistics)
        );
    };
    const handleOk = () => {
        setAddAdjustmentVisible(false);
        setAddStandardVisible(false);
        fetchList();
        // 通知外部进行相应刷新等动作
        adjustOk(true);
    };
    const handleChangeParams = <T extends keyof IStandardPriceParams>(key: T, value: IStandardPriceParams[T]) => {
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
                        value={params.meter_type_id}
                        onChange={e => handleChangeParams('meter_type_id', e.target.value)}
                    >
                        {statisticsInfo.map(item => (
                            <RadioButton key={item.value} value={item.id}>
                                {item.value}
                                {+item.num > 0 ? `·${item.num}` : null}
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
                <div className="filter-right">
                    <Checkbox onChange={e => handleChangeParams('is_enabled', `${+e.target.checked}` as ENABLE)}>
                        只看已启用内容
                    </Checkbox>
                </div>
            </div>
            <FedTable<IStandardPriceItem>
                loading={loading}
                columns={columns}
                dataSource={standardDataSource}
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
            {addStandardVisible ? (
                <EditStandardModal
                    onCancel={() => setAddStandardVisible(false)}
                    editItem={editItem as IStandardPriceItem}
                    onOk={() => handleOk()}
                />
            ) : null}
            {addAdjustmentVisible ? (
                <EditAdjustmentModal
                    onCancel={() => setAddAdjustmentVisible(false)}
                    editItem={editItem as IStandardPriceItem}
                    onOk={() => handleOk()}
                />
            ) : null}
        </>
    );
};
export default Standard;
