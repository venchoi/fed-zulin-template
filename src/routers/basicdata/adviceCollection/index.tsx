import React from 'react';
import { Spin, PageHeader, Input, Table } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
const { Search } = Input;

const routes = [
    {
        path: '/static//basicdata',
        breadcrumbName: '杂项费用',
    },
    {
        path: '',
        breadcrumbName: '收款通知',
    },
];

function App() {
    const itemRender = (route: any) => {
        if (route.path) {
            return (
                <a href={route.path} key={route.path}>
                    {route.breadcrumbName}
                </a>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '通知人员',
            dataIndex: 'man',
            key: 'man',
        },
        {
            title: '启用状态',
            dataIndex: 'is_enable',
            key: 'is_enable',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render(value: any) {
                return <a onClick={() => {}}>配置</a>;
            },
        },
    ];
    const customExpandIcon = ({ expanded, onExpand, record }: any) => {
        if (record.children && record.children.length > 0) {
            return expanded ? (
                <UpOutlined onClick={e => onExpand(record, e)} />
            ) : (
                <DownOutlined onClick={e => onExpand(record, e)} />
            );
        } else {
            return <span style={{ marginRight: 8 }}></span>;
        }
    };

    return (
        <Spin spinning={false}>
            <PageHeader
                breadcrumb={{ routes, itemRender, separator: '>' }}
                style={{ backgroundColor: '#fff' }}
                title="收款通知"
            />
            <div style={{ padding: '16px', backgroundColor: '#F5F6F7' }}>
                <div style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Search placeholder="请输入项目" onSearch={value => console.log(value)} style={{ width: 200 }} />
                    <Table expandRowByClick expandIcon={props => customExpandIcon(props)} />
                </div>
            </div>
        </Spin>
    );
}
export default App;
