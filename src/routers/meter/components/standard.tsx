/**
 * 标准单价管理
 */
import React, { useState } from 'react';
import { Radio } from 'antd';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { IStandardPriceItem } from '../../../types/meter';

const { Group: RadioGroup, Button: RadioButton } = Radio;

const Standard = () => {
    const [standardDataSource, setStandardDataSource] = useState([]);
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
            dataIndex: 'name',
            title: '名称',
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
            title: '是否启用',
        },
    ];
    return (
        <>
            <FedTable columns={columns} dataSource={standardDataSource} />
        </>
    );
};
export default Standard;
