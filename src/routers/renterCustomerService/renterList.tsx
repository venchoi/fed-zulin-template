import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge, Popconfirm, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SearchArea from './components/renterListSearchArea';
import FedPagination from '@c/FedPagination';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { basicRenterListColumns } from './listComponent';
import { getRenterList, unbindRenter } from '@s/renterCustomerService';
import { RenterListProps, renterListType, paramsType } from './list.d';
import {
    getrenterListParams
} from '@/types/renterCustomerService';
import './renterList.less';

export const renterList = (props: RenterListProps) => {
    const { 
        setLoading, 
        setTotalSize, 
        page, 
        pageSize, 
        stageId,
        handleShowAddAdminModal,
        requestRenterList
    } = props;
    const [renterList, setRenterList] = useState<renterListType[]>([]);
    const [searchParams, setsearchParams] = useState<getrenterListParams>({
        stage_id: '',
        keyword: '',
        page: 1,
        page_size: 10,
        renter_type: '',
        contract_status: ''
    });

    useEffect(() => {
        setsearchParams({
            ...searchParams,
            page,
            page_size: pageSize
        });
    }, [page, pageSize]);

    useEffect(() => {
        setsearchParams({
            ...searchParams,
            stage_id: stageId
        });
    }, [stageId]);

    useEffect(() => {
        getRenterCustomerList();
    }, [searchParams, requestRenterList]);

    // 获取租户管理员列表数据
    const getRenterCustomerList = async () => {
        let params = Object.assign({}, searchParams);
        if (!params.stage_id) {
            return;
        }
        setLoading(true);
        const { result, data } = await getRenterList(params);
        if (result && data) {
            setRenterList(data.items || []);
            setTotalSize(data.total);
        }
        setLoading(false);
    };

    // 解绑操作
    const handleUnbindRenter = (record: renterListType) => async () => {
        setLoading(true);
        const params = {
            id: record.id
        };
        const { result } = await unbindRenter(params);
        if (result) {
            message.success('解绑成功');
            getRenterCustomerList();
        }
        setLoading(false);
    }

    // 显示编辑弹窗
    const showEditAdminModal = (record: renterListType) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        handleShowAddAdminModal && handleShowAddAdminModal(record);
    }

    const handleSearch = (value: paramsType) => {
        setsearchParams({
            ...searchParams,
            ...value
        });
    };

    const columns: ColumnProps<renterListType>[]= [
        ...basicRenterListColumns,
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 140,
            render: (text: string, record: renterListType, index: number) => {
                return (<div className="op-col">
                    <Button
                        type="link"
                        className="operate-btn f-hidden renter-customers-service-change-manager"
                        onClick={showEditAdminModal(record)}
                    >
                        更换管理员
                    </Button>
                    <Popconfirm
                        placement="bottomRight"
                        overlayClassName="unbind-btn-popover"
                        title="确定解除绑定关系？解除后该管理员将不能继续通过微信公众号接收系统消息?"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={handleUnbindRenter(record)}
                    >
                        <Button
                            type="link"
                            className="f-hidden renter-customers-service-add-manager"
                        >
                            解绑
                        </Button>
                    </Popconfirm>
                </div>)
            }
        },
    ];
    return (
        <div className="renter-list-page">
            <SearchArea 
                keywordValue={searchParams.keyword || ''}
                onSearch={handleSearch}
            />
            <FedTable<renterListType>
                className="renter-list-table"
                vsides={false}
                rowKey="id"
                columns={columns}
                dataSource={renterList}
                scroll={{
                    y: 'calc( 100vh - 340px )',
                }}
            />
        </div>
    );
}

export default renterList;