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
        fetchFields().then();
    }, [location]);
    useEffect(() => {
        fetchCustomLayOut().then();
    }, [fieldData]);
    useEffect(() => {
        fetchList().then();
    }, [layoutData]);
    // 表格布局字段
    const fetchCustomLayOut = async () => {
        const { data } = await getCustomLayout({ key: type_value_code });
        const result: IGetCustomLayout[] = (data && data.asset_holder_layout) || [];
        setLayoutData(result);
    };
    // 初始默认字段
    const fetchFields = async () => {
        const { data } = await getFiles({ type: type_value });
        const result: IField[] = data || [];
        const fieldData = cloneDeep(result);
        fieldData.map(field => (field.selected = field.is_default));
        setFieldData(fieldData);
    };
    // 表格数据
    const fetchList = async () => {
        const params = {
            advanced_select_fields: mergeCanUseField(),
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
    };
    // 合并Custom字段
    const mergeCanUseField = () => {
        let optionsData: IField[] = [];
        if (layoutData && layoutData.length > 0 && fieldData && fieldData.length > 0) {
            layoutData.forEach(item => {
                const result = fieldData.find(f => f.field === item.field);
                if (result) {
                    optionsData.push(result);
                }
            });
        } else {
            optionsData = fieldData;
        }
        return optionsData;
    };
    // 调用接口
    const getAll = async () => {
        await fetchFields();
        await fetchCustomLayOut();
        await fetchList();
    };

    // 新增、筛选区域
    const extra = (
        <>
            <TreeProjectSelect width={324} isjustselect="true" />
            &nbsp;
            <Link to="/asset-holder/add" className="ant-btn ant-btn-primary">
                新增
            </Link>
        </>
    );

    const onCancel = () => {
        setShowBaseInfoModal(false);
    };
    const onSave = (values: IAddAssetHolderBank) => {
        setShowBaseInfoModal(false);
        // 刷新列表
    };
    // 渲染可配置列弹框
    const renderExtraNode = () => {
        // 确定点击事件
        const onFinish = (resultArr: IField[]) => {
            const saveArr: { field: string; width: number }[] = [];
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
        // 取消点击事件
        const onCancel = () => {
            setVisible(false);
        };
        // 配置列数据 如果layoutData返回值为空时，默认使用fieldData数据
        let optionsData: IField[] = mergeCanUseField();
        return <DragSelect options={optionsData} onFinish={onFinish} onCancel={onCancel} />;
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
                                    <Select.Option value={cType.value} key={cType.value}>
                                        {cType.name}
                                    </Select.Option>
                                ))}
                            </Select>
                            <Select placeholder="合作状态" className="filter-item">
                                {cooperateStatus.map(cType => (
                                    <Select.Option value={cType.value} key={cType.value}>
                                        {cType.name}
                                    </Select.Option>
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
                </Card>
                {showBaseInfoModal ? <AddBaseForm id="" onCancel={onCancel} onOk={onSave} /> : null}
            </div>
        </>
    );
};
export default List;
