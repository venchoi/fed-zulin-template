/**
 * 标准单价管理
 */
import React, { useState, useEffect } from 'react';
import { Radio, Input, Checkbox, Switch, message } from 'antd';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { IStandardPriceItem, IStandardPriceParams } from '@t/meter';
import { getStandardPriceList, postPriceEnabled } from '@s/meter';
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
    const [params, setParams] = useState({
        meter_type_id: '',
        is_enabled: '',
        keyword: '',
    });
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
        },
        {
            dataIndex: 'remark',
            title: '说明',
        },
        {
            dataIndex: 'effect_date',
            title: '生效时间',
        },
        {
            dataIndex: 'is_enabled',
            title: '是否启用',
            render: (text, rowData) => {
                return <Switch checked={!!+text} onChange={e => handlePriceEnabled(rowData)} />;
            },
        },
        {
            dataIndex: 'id',
            title: '操作',
        },
    ];
    const handlePriceEnabled = async (rowData: IStandardPriceItem) => {
        const { result } = await postPriceEnabled({ id: rowData.id });
        if (result) {
            message.success('操作成功');
            fetchList();
        }
    };
    const fetchList = async () => {
        const { data } = await getStandardPriceList({ ...pageObj, ...params });
        setStandardDataSource(data?.items || []);
    };
    const handleChangeParams = <T extends keyof IStandardPriceParams>(key: T, value: IStandardPriceParams[T]) => {
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
                    <Search
                        placeholder="名称、说明"
                        value={params.keyword}
                        onChange={e => handleChangeParams('keyword', e.target.value)}
                    />
                </div>
                <div className="filter-right">
                    <Checkbox onChange={e => handleChangeParams('is_enabled', `${+e.target.checked}`)}>
                        只看已启用内容
                    </Checkbox>
                </div>
            </div>
            <FedTable columns={columns} dataSource={standardDataSource} />
        </>
    );
};
export default Standard;
