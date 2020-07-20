import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'dva/router';
import { Button, Card, Dropdown, Input, message, Popconfirm, Pagination, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ResizeTable, DragSelect } from 'ykj-ui';
import { cloneDeep } from 'lodash';
import {
    getAssetHolderList,
    getCustomLayout,
    getFiles,
    postCustomLayout,
    deleteAssetHolder,
} from '@/services/assetHolder';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { IAddAssetHolderBank, IGetCustomLayout, IField } from '@t/assetHolder';
import { IHeader } from '../../constants/layoutConfig';
import { customType, cooperateStatus } from '../../constants/index';
import calcBodyHeight from './utils';
import AddBaseForm from './components/addBaseForm';
// import MaxHeightTable from 'ykj-ui/es/components/max-height-table'
import './index.less';
const Table = calcBodyHeight(ResizeTable);
const { Search } = Input;
const List = ({ location }: RouteComponentProps) => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [showBaseInfoModal, setShowBaseInfoModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState([]);
    const [fieldData, setFieldData] = useState<IField[]>([]);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [layoutData, setLayoutData] = useState<IGetCustomLayout[]>([]);
    const type_value = '资产持有人列表';
    const type_value_code = 'asset_holder_layout';

    useEffect(() => {
        getAll();
    }, [location]);

    const fetchCustomLayOut = async () => {
        const { data } = await getCustomLayout({ key: type_value_code });
        const result: IGetCustomLayout[] = (data && data.asset_holder_layout) || [];
        setLayoutData(result);
    };
    const fetchFields = async () => {
        const { data } = await getFiles({ type: type_value });
        const result: IField[] = data || [];
        const fieldData = cloneDeep(result);
        fieldData.map(field => (field.selected = field.is_default));
        setFieldData(fieldData);
    };
    const fetchList = async () => {
        const params = {
            advanced_select_fields: fieldData.filter(field => field.is_default) || [],
            page: 1,
            page_size: 20,
        };
        const { data } = await getAssetHolderList(params);
        const { head, items } = data || { head: [], items: [] };
        const head2TableHeader = (head: IField[]) => {
            const arr: IHeader[] = [];
            head.map(it => {
                arr.push({
                    title: it.name,
                    dataIndex: it.field,
                    key: it.field,
                    sort: true,
                    width: 100,
                });
            });

            const confirm = (item: IField) => {
                deleteAssetHolder({ id: item.id }).then((json: { result: boolean; msg: string }) => {
                    const { result, msg } = json;
                    if (result) {
                        message.success('删除成功!');
                        getAll();
                    } else {
                        message.error(msg || '删除失败');
                    }
                });
            };

            arr.push({
                title: '操作',
                width: 100,
                align: 'center',
                fixed: 'right',
                isNoResize: true,
                render: (item: IField) => (
                    <>
                        <Link className="record-opt-btn" to={`/asset-holder/detail/${item.id}`}>
                            详情
                        </Link>
                        <Link className="record-opt-btn" to={`/asset-holder/edit/${item.id}`}>
                            编辑
                        </Link>
                        <Popconfirm
                            placement="topRight"
                            title="确定删除该资产持有人吗?"
                            onConfirm={() => {
                                confirm(item);
                            }}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a className="record-opt-btn">删除</a>
                        </Popconfirm>
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
    const renderExtraNode = () => {
        const resetSetting = () => {};
        const onFinish = resultArr => {
            const saveArr = [];
            resultArr && resultArr.map(item => saveArr.push({ field: item.field, width: 100 }));
            postCustomLayout({ key: type_value_code, value: saveArr }).then(json => {
                const { result, msg } = json;
                if (result) {
                    setVisible(false);
                    message.success('保存成功');
                    getAll();
                } else {
                    message.error(msg || '操作失败');
                }
            });
        };
        const onCancel = () => {
            setVisible(false);
        };
        return <DragSelect options={fieldData} onFinish={onFinish} onCancel={onCancel} />;
    };
    const handleVisibleChange = (val: boolean, callback: Function) => {
        setVisible(val);
    };
    // 表头宽度设置
    const onHandleResize = (index, size) => {
        // 保存宽度
        console.log('index', index, 'size', size);
    };
    const onTablePaginationChange = (pagination, filters, sorter, extra) => {};
    // 页码变化的回调
    const onPaginationChange = page => {
        const { history, location } = this.props;
    };
    // pageSize变化的回调
    const onPageSizeChange = (current, size) => {};

    return (
        <>
            <div className="layout-list" style={{ height: '100%' }}>
                <Card className="asset-holder-card" title="资产持有人管理" bordered={false} extra={extra}>
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
                            <Dropdown
                                placement="bottomRight"
                                visible={visible}
                                onVisibleChange={handleVisibleChange}
                                overlay={renderExtraNode}
                                trigger={['click']}
                            >
                                <Button className="btn-setting" icon={<SettingOutlined />} />
                            </Dropdown>
                        </div>
                    </div>

                    <div className="table-list-wrap no-table-border-left no-table-border-right">
                        <Table
                            rowKey="id"
                            align="left"
                            size="small"
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
                    <div className="table-pagination" style={{ display: 'none' }}>
                        <Pagination
                            current={1}
                            pageSize={10}
                            total={11}
                            showQuickJumper
                            showSizeChanger
                            showTotal={total => `共${Math.ceil(total / 11)}页，${total}条记录`}
                            onChange={(page, pageSize) => onPaginationChange(page, pageSize)}
                            onShowSizeChange={(current, size) => onPageSizeChange(current, size)}
                        />
                    </div>
                </Card>
                {showBaseInfoModal ? <AddBaseForm id="" onCancel={onCancel} onOk={onSave} /> : null}
            </div>
        </>
    );
};
export default List;
