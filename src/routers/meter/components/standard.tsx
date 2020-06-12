/**
 * 标准单价管理
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'dva/router';
import { Radio, Input, Checkbox, Switch, message, Button } from 'antd';
import { sumBy } from 'lodash';
import FedTable from '@c/FedTable';
import FedPagination from '@c/FedPagination';
import { ColumnProps } from 'antd/es/table';
import {
    IStandardPriceItem,
    IStandardPriceParams,
    IStatisticsItem,
    IMeterTypeStatisticItem,
    StandardHandleType,
} from '@t/meter';
import { ENABLE } from '@t/common';
import { getStandardPriceList, postStandardPrice } from '@s/meter';
import EditModal from './editModal';
// import Filter from './adjustmentFilter'

const { Group: RadioGroup, Button: RadioButton } = Radio;
const { Search } = Input;

const Standard = () => {
    const [standardDataSource, setStandardDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageObj, setPageObj] = useState({
        page: 1,
        page_size: 20,
    });
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editItem, setEditItem] = useState({});
    const [params, setParams] = useState({
        meter_type_id: '',
        is_enabled: ENABLE.NOTENABLED,
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
            width: 106,
        },
        {
            dataIndex: 'price',
            title: '单价',
            width: 132,
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
                    <>
                        <Button type="link" onClick={() => handleEditPrice(rowData)}>
                            调整价格
                        </Button>
                        <Button type="link">
                            <Link to={`/meter/detail-standard/${rowData.id}`}>详情</Link>
                        </Button>
                        <Button type="link" onClick={() => handleEdit(rowData)}>
                            编辑
                        </Button>
                        <Button type="link" onClick={() => handleDelete(rowData)}>
                            删除
                        </Button>
                    </>
                );
            },
        },
    ];
    const handleEditPrice = (rowData: IStandardPriceItem) => {};
    const handleEdit = (rowData: IStandardPriceItem) => {
        setEditItem(rowData);
        setAddModalVisible(true);
    };

    const handleDelete = async (rowData: IStandardPriceItem) => {
        const { result } = await postStandardPrice({ type: StandardHandleType.DELETE, id: rowData.id });
        if (result) {
            message.success('操作成功');
            fetchList();
        }
    };

    const handlePriceEnabled = async (rowData: IStandardPriceItem) => {
        const { result } = await postStandardPrice({ type: StandardHandleType.ENABLED, id: rowData.id });
        if (result) {
            message.success('操作成功');
            fetchList();
        }
    };
    const fetchList = async () => {
        const { data } = await getStandardPriceList({ ...pageObj, ...params });
        setStandardDataSource(data?.items || []);
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
        setAddModalVisible(false);
        fetchList();
    };
    const handleChangeParams = <T extends keyof IStandardPriceParams>(key: T, value: IStandardPriceParams[T]) => {
        setParams(prvState => ({ ...prvState, ...{ [key]: value } }));
    };
    useEffect(() => {
        setPageObj({ ...pageObj, page: 1 });
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
            <FedTable<IStandardPriceItem> columns={columns} dataSource={standardDataSource} vsides rowKey="id"/>
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
            {addModalVisible ? (
                <EditModal
                    onCancel={() => setAddModalVisible(false)}
                    editItem={editItem as IStandardPriceItem}
                    onOk={() => handleOk()}
                />
            ) : null}
        </>
    );
};
export default Standard;
