import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'dva/router';
import './index.less';
import { Button, Card, PageHeader, Modal, Dropdown } from 'antd';
import AddBaseForm from './components/addBaseForm';
import { ResizeTable, DragSelect, MaxHeightTable } from 'ykj-ui';
import AddBankForm from '@/routers/assetHolder/components/addBankForm';
import { IAddAssetHolderBank } from '@t/assetHolder';
import { getAssetHolderList } from '@/services/assetHolder';
import { CloseCircleFilled, DownloadOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';

const Table = ResizeTable;

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
