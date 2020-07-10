import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'dva/router';
import { Button, Card, Input, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ResizeTable, DragSelect, MaxHeightTable } from 'ykj-ui';
import { getAssetHolderList, getCustomLayout, getFiles } from '@/services/assetHolder';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { IAddAssetHolderBank, IGetCustomLayout, IField } from '@t/assetHolder';
import { IHeader } from '../../constants/layoutConfig';
import { customType, cooperateStatus } from '../../constants/index';
import AddBaseForm from './components/addBaseForm';
import './index.less';

const Table = ResizeTable;
const { Search } = Input;
const List = ({ location }: RouteComponentProps) => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [showBaseInfoModal, setShowBaseInfoModal] = useState(false);
    const [columns, setColumns] = useState([]);
    const [fieldData, setFieldData] = useState<IField[]>([]);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [layoutData, setLayoutData] = useState<IGetCustomLayout[]>([]);

    useEffect(() => {
        getAll();
    }, [location]);

    const fetchCustomLayOut = async () => {
        const { data } = await getCustomLayout({ key: 'asset_holder_layout' });
        const result: IGetCustomLayout[] = (data && data.asset_holder_layout) || [];
        setLayoutData(result);
    };
    const fetchFields = async () => {
        const { data } = await getFiles({ type: '资产持有人列表' });
        const result: IField[] = data || [];
        setFieldData(result);
    };
    const fetchList = async () => {
        const params = {
            advanced_select_fields: fieldData.filter(field => field.is_default) || [],
            page: 1,
            page_size: 20,
        };
        const { data } = await getAssetHolderList(params);
        const { head, items } = data;
        const head2TableHeader = (head: IField[]) => {
            const arr: IHeader[] = [];
            head.map(it => {
                arr.push({
                    title: it.name,
                    dataIndex: it.field,
                    key: it.field,
                    sort: true,
                });
            });
            arr.push({
                title: '操作',
                width: 120,
                align: 'center',
                fixed: 'right',
                isNoResize: true,
                render: text => (
                    <>
                        <span className="text-link">查看</span>&nbsp;
                        <span className="text-link">删除</span>
                    </>
                ),
            });
            return arr;
        };
        setColumns(head2TableHeader(head));
        setList(items);
        console.log(data);
    };

    const getAll = () => {
        fetchFields().then(() => {
            fetchCustomLayOut().then(() => {
                fetchList();
            });
        });
    };

    // 新增、筛选区域
    const extra = (
        <>
            <TreeProjectSelect width={324} isJustSelect />
            &nbsp;
            <Button type="primary" onClick={() => setShowBaseInfoModal(true)} className="f-hidden meter-standard-add">
                新增
            </Button>
        </>
    );

    const onCancel = () => {
        setShowBaseInfoModal(false);
    };
    const onSave = (values: IAddAssetHolderBank) => {
        setShowBaseInfoModal(false);
        // 刷新列表
    };

    const onHandleResize = (index, size) => {};
    const onTablePaginationChange = (pagination, filters, sorter, extra) => {};
    return (
        <>
            <div className="layout-list">
                <Card className="asset-holder-card" title="资产持有人管理" bordered={false} extra={extra}>
                    <div className="table-list-wrap no-table-border-left no-table-border-right">
                        <div className="filter">
                            <div className="filter-left">
                                <Search style={{ width: '312px' }} placeholder="计划名称" />
                                <Select placeholder="类型" className="filter-item">
                                    {customType.map(cType => (
                                        <Option value={cType.value} key={cType.value}>
                                            {cType.name}
                                        </Option>
                                    ))}
                                </Select>
                                <Select placeholder="合作状态" className="filter-item">
                                    {cooperateStatus.map(cType => (
                                        <Option value={cType.value} key={cType.value}>
                                            {cType.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="filter-right">
                                <SettingOutlined />
                            </div>
                        </div>

                        <Table
                            rowKey="id"
                            align="left"
                            bordered
                            columns={columns}
                            dataSource={list}
                            scroll={{ x: 1208, y: true }}
                            loading={isTableLoading}
                            onHandleResize={onHandleResize}
                            onPaginationChange={onTablePaginationChange}
                            pagination={true}
                        />
                    </div>
                </Card>
                {showBaseInfoModal ? <AddBaseForm id="" onCancel={onCancel} onOk={onSave} /> : null}
            </div>
        </>
    );
};
export default List;
