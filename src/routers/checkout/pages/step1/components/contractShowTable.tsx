import React from 'react';
import { message, Table, Popconfirm, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const PageModuleHeader = () => {
    const columns = [
        {
            title: '合同编号',
            dataIndex: 'bank',
            key: 'bank',
            width: 100,
        },
        {
            title: '合同期限',
            dataIndex: 'account',
            key: 'account',
            width: 100,
        },
    ];
    // dataSource={data}
    return (
        <>
            <div>
                退租合同：{' '}
                <Button>
                    <PlusOutlined />
                    选择合同
                </Button>
            </div>
            <Table columns={columns} size="small" bordered />
        </>
    );
};

export default PageModuleHeader;
