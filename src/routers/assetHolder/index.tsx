import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'dva/router';
import { Button, Card, PageHeader, Modal, Dropdown, Input } from 'antd';
import { CloseCircleFilled, DownloadOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { ResizeTable, DragSelect, MaxHeightTable } from 'ykj-ui';
import { getAssetHolderList } from '@/services/assetHolder';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { IAddAssetHolderBank } from '@t/assetHolder';
import AddBaseForm from './components/addBaseForm';
import './index.less';

const Table = ResizeTable;
const { Search } = Input;
const List = ({ location }: RouteComponentProps) => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [showBaseInfoModal, setShowBaseInfoModal] = useState(false);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);

    useEffect(() => {
        fetchList();
    }, [location]);

    const fetchList = async () => {
        const params = {
            page: 1,
            page_size: 20,
        };
        const { data } = await getAssetHolderList(params);
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
