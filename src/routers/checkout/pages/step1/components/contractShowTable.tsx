import React from 'react';
import { Link } from 'dva/router';
import { Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const PageModuleHeader = () => {
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
    const obj = { width: '844px', marginTop: '16px' };
    return (
        <>
            <div style={{ marginTop: '16px' }}>
                <span style={{ color: '#F73E4D', marginRight: '4px' }}>*</span>退租合同：
                <Button style={{ marginLeft: '8px' }}>
                    <PlusOutlined />
                    选择合同
                </Button>
            </div>

            <Table dataSource={data} columns={columns} size="small" bordered pagination={false} style={obj} />
        </>
    );
};

export default PageModuleHeader;
