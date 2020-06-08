/**
 * 标准单价管理
 */
import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { IStandardPriceItem } from '@t/meter';
import { getStandardPriceList } from '@s/meter';

const { Group: RadioGroup, Button: RadioButton } = Radio;

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
        },
        {
            dataIndex: 'id',
            title: '操作',
        },
    ];
    const fetchList = async () => {
        const { data } = await getStandardPriceList({ ...pageObj, ...params });
        setStandardDataSource(data?.items || []);
    };
    useEffect(() => {
        setPageObj({ ...pageObj, page_size: 1 });
    }, [params]);

    useEffect(() => {
        fetchList();
    }, [pageObj]);
    return (
        <>
            <FedTable columns={columns} dataSource={standardDataSource} />
        </>
    );
};
export default Standard;
