import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Table, Button, Space } from 'antd';
import './addBaseForm.less';
import { getIdCardList, postAddAssetHolder } from '@/services/assetHolder';
import { IAddAssetHolderBank } from '@t/assetHolder';

interface IProps {
    onFinishUpdate?: () => void; // 数据更新完回调
    data: IAddAssetHolderBank[]; // 数据
    isCanOperate: boolean; // 是否显示操作
}
const BankTable = ({ data, isCanOperate = false }: IProps) => {
    useEffect(() => {}, []);
    const columns = [
        {
            title: '开户行',
            dataIndex: 'bank',
            key: 'bank',
        },
        {
            title: '银行账号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '户名',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
    ];

    if (isCanOperate) {
        columns.push({
            dataIndex: 'id',
            title: '操作',
            width: 163,
            render: (text, rowData) => {
                return (
                    <div>
                        <a>编辑</a>
                        <a>删除</a>
                    </div>
                );
            },
        });
    }

    return (
        <>
            <Table dataSource={data} columns={columns} />
        </>
    );
};

export default BankTable;
