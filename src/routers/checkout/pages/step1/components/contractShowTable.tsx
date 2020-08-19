/**
 * 展示选择的合同信息
 * 包括 选择合同的按钮 与 选择的合同信息
 */
import React, { useState } from 'react';
import { Link } from 'dva/router';
import { Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SelectContractModal from './selectContractModal';
import './contractShowTable.less';

const ContractShowTable = () => {
    const [showModal, setShowModal] = useState(false);
    const columns = [
        {
            title: '合同编号',
            dataIndex: 'code',
            key: 'code',
            render: (item: string) => {
                return <Link to="/asset-holder/list">{item}</Link>;
            },
        },
        {
            title: '合同期限',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '所属项目',
            dataIndex: 'project',
            key: 'project',
        },
    ];
    const data = [
        {
            code: 'TZ20200726015428838',
            time: '2019-08-08 至 2020-08-08',
            project: '丁家庄项目',
        },
    ];

    return (
        <>
            <div className="checkout-contract-show-table-wrap">
                <span className="require">*</span>
                <span className="label-title">退租合同：</span>
                <Button
                    className="add-contract-btn"
                    onClick={() => {
                        setShowModal(!showModal);
                    }}
                >
                    <PlusOutlined style={{ color: '#868B8F' }} />
                    选择合同
                </Button>
                <Table
                    dataSource={data}
                    columns={columns}
                    size="small"
                    bordered
                    pagination={false}
                    className="contract-table"
                />
            </div>
            {showModal ? (
                <SelectContractModal
                    onCancel={() => {
                        setShowModal(!showModal);
                    }}
                />
            ) : null}
        </>
    );
};

export default ContractShowTable;
