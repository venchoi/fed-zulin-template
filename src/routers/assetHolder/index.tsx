import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'dva/router';
import { Button, Card, Dropdown, Input, message, Popconfirm, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ResizeTable, DragSelect } from 'ykj-ui';
import { cloneDeep, debounce, throttle } from 'lodash';
import {
    getAssetHolderList,
    getCustomLayout,
    getFiles,
    postCustomLayout,
    deleteAssetHolder,
} from '@/services/assetHolder';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { IGetCustomLayout, IField } from '@t/assetHolder';
import { IHeader } from '../../constants/layoutConfig';
import { customType, cooperateStatus } from '../../constants/index';
import calcBodyHeight from './utils';
import FedPagination from '@c/FedPagination';
import './index.less';

const Table = calcBodyHeight(ResizeTable);
const { Search } = Input;
let timer: NodeJS.Timeout;
const List = ({ location }: RouteComponentProps) => {
    const [pageObj, setPageObj] = useState({
        page: 1,
        page_size: 20,
    });
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState<IHeader[]>([]);
    const [fieldData, setFieldData] = useState<IField[]>([]);
    const [isFetchField, setIsFetchField] = useState(false);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [layoutData, setLayoutData] = useState<IGetCustomLayout[]>([]);
    const [sortField, setField] = useState('');
    const [sortDirections, setSortDirections] = useState('');
    const [keywords, setKeywords] = useState('');
    const [IdCodeType, setIdCodeType] = useState('');
    const [copStatus, setCopStatus] = useState('');
    const type_value = '资产持有人列表';
    const type_value_code = 'asset_holder_layout';
    useEffect(() => {
        fetchFields().then();
    }, [location]);
    useEffect(() => {
        fetchCustomLayOut().then();
    }, [fieldData, isFetchField, sortField, sortDirections]);
    useEffect(() => {
        fetchList().then();
    }, [layoutData, keywords, IdCodeType, copStatus]);
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
        fieldData.map((field: IField) => (field.selected = field.is_default));
        setFieldData(fieldData);
    };
    // 表格数据
    const fetchList = async () => {
        setIsTableLoading(true);
        const params = {
            advanced_select_fields: mergeCanUseField(),
            page: pageObj.page,
            page_size: pageObj.page_size,
            name: keywords,
            order_by: sortField,
            order_method: sortDirections,
            type: IdCodeType,
            status: copStatus,
        };
        const { data } = await getAssetHolderList(params);
        const { head, items, total } = data || { head: [], items: [], total: 0 };
        const head2TableHeader = (head: IField[]) => {
            const arr: IHeader[] = [];
            head.map(it => {
                arr.push({
                    title: it.name,
                    dataIndex: it.field,
                    key: it.field,
                    sorter: true,
                    width: it.width || 100,
                    ellipsis: true,
                });
            });
            const confirm = (item: IField) => {
                deleteAssetHolder({ id: item.id || '' }).then((json: { result: boolean; msg: string }) => {
                    const { result, msg } = json;
                    if (result) {
                        message.success('删除成功!');
                        fetchList().then();
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
        setTotal(total);
        setIsTableLoading(false);
    };
    // 合并Custom字段
    const mergeCanUseField = () => {
        let optionsData: IField[] = [];
        if (layoutData && layoutData.length > 0 && fieldData && fieldData.length > 0) {
            layoutData.forEach(item => {
                const result = fieldData.find(f => f.field === item.field);
                if (result) {
                    result.width = item.width;
                    optionsData.push(result);
                }
            });
        } else {
            optionsData = fieldData;
        }
        return optionsData;
    };
    // 新增、筛选区域
    const extra = (
        <>
            <TreeProjectSelect width={324} isjustselect="true" />
            <Link to="/asset-holder/add" className="ant-btn ant-btn-primary" style={{ marginLeft: 16 }}>
                新增
            </Link>
        </>
    );
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
                    setIsFetchField(!isFetchField);
                    message.success('保存成功');
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
    // 表头 自定义列宽throttle
    const onHandleResizeThrottle = (index: number, size: { width: number; height: number }) => {
        const copyColumns: IHeader[] = cloneDeep(columns);
        if (copyColumns && copyColumns.length > index) {
            copyColumns[index].width = size.width;
            setColumns(copyColumns);
        }
        // 保存表頭列寬
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            const arr: { field: string; width: number }[] = [];
            copyColumns.forEach(column => {
                if (column.dataIndex) {
                    arr.push({ field: column.dataIndex, width: column.width });
                }
            });
            postCustomLayout({ key: type_value_code, value: arr });
        }, 800);
    };
    // 表头 自定义列宽回调
    const onHandleResize = throttle(onHandleResizeThrottle, 100);
    // 表头 排序回调
    const onHandleTableChange = (pagination: {}, filters: {}, sorter: { field: string; order: string }) => {
        setField(sorter.field);
        setSortDirections((sorter.order || '').replace('end', ''));
    };
    // 计划名称、类型、合作状态 数据变化事件
    const handleChange = (type: string, value: string) => {
        switch (type) {
            case 'name':
                setKeywords(value);
                break;
            case 'type':
                setIdCodeType(value);
                break;
            case 'status':
                setCopStatus(value);
                break;
            default:
                break;
        }
    };
    return (
        <>
            <div className="layout-list" style={{ height: '100%' }}>
                <Card className="asset-holder-card" title="资产持有人管理" bordered={false} extra={extra}>
                    <div className="filter">
                        <div className="filter-left">
                            <Search
                                style={{ width: '312px' }}
                                placeholder="计划名称"
                                onSearch={value => handleChange('name', value)}
                            />
                            <Select
                                placeholder="类型"
                                className="filter-item"
                                value={IdCodeType}
                                onChange={handleChange.bind(null, 'type')}
                            >
                                <Select.Option value="" key="">
                                    全部
                                </Select.Option>
                                {customType.map(cType => (
                                    <Select.Option value={cType.value} key={cType.value}>
                                        {cType.name}
                                    </Select.Option>
                                ))}
                            </Select>
                            <Select
                                placeholder="合作状态"
                                className="filter-item"
                                value={copStatus}
                                onChange={handleChange.bind(null, 'status')}
                            >
                                <Select.Option value="" key="">
                                    全部
                                </Select.Option>
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
                            onChange={onHandleTableChange}
                            pagination={false}
                        />
                    </div>
                    <FedPagination
                        onShowSizeChange={(current, page_size) => {
                            //setPageObj({ page: 1, page_size });
                        }}
                        onChange={(page, page_size) => {
                            //setPageObj({ page, page_size: page_size || 20 });
                        }}
                        current={pageObj.page}
                        pageSize={pageObj.page_size}
                        showTotal={total => `共${Math.ceil(+total / +(pageObj.page_size || 1))}页， ${total}条记录`}
                        total={+total}
                    />
                </Card>
            </div>
        </>
    );
};
export default List;
