import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge, Popconfirm } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import AuditSearchArea from './components/auditListSearchArea';
import FedPagination from '@c/FedPagination';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { basicAuditListColumns } from './listComponent';
import { getAuditList } from '@s/renterCustomerService';
import { AuditListProps, auditListType, searchAreaProps } from './list.d';
import {
    getAuditListParams
} from '@/types/renterCustomerService';
import './auditList.less';

export const auditList = (props: AuditListProps) => {
    const { setLoading, setTotalSize, page, pageSize, stageId } = props;
    const [auditList, setRenterList] = useState<auditListType[]>([]);
    const [searchParams, setsearchParams] = useState<getAuditListParams>({
        stage_id: '',
        keyword: '',
        page: 1,
        page_size: 10,
        status: ''
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
    }, [searchParams]);

    // 获取租户管理员列表数据
    const getRenterCustomerList = async () => {
        let params = Object.assign({}, searchParams);
        if (!params.stage_id) {
            return;
        }
        setLoading(true);
        const { result, data } = await getAuditList(params);
        if (result && data) {
            setRenterList(data.items || []);
            setTotalSize(data.total);
        }
        setLoading(false);
    };

    const handleTableChange = () => {

    }

    const handleSearch = (value: searchAreaProps) => {
        setsearchParams({
            ...searchParams,
            ...value
        });
    };

    const columns: ColumnProps<auditListType>[]= [
        ...basicAuditListColumns,
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 140,
            render: (text: string, record: auditListType, index: number) => {
                return (<div className="op-col">
                    {
                        record.status === '待审核' ?
                            <Popconfirm
                                placement="bottomRight"
                                title={text}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button
                                    type="link"
                                    className="operate-btn f-hidden renter-customers-service-audit"
                                >
                                    审核
                                </Button>
                            </Popconfirm>
                            :
                            null
                    }
                    {
                        record.status === '已审核' ?
                            <Button
                                type="link"
                                className="operate-btn f-hidden renter-customers-service-audit"
                            >
                                详情
                            </Button>
                            :
                            null
                    }
                    
                </div>)
            }
        },
    ];
    return (
        <div className="renter-list-page">
            <AuditSearchArea 
                keywordValue={searchParams.keyword || ''}
                onSearch={handleSearch}
            />
            <FedTable<auditListType>
                className="renter-list-table"
                vsides={false}
                rowKey="id"
                columns={columns}
                dataSource={auditList}
                scroll={{
                    y: 'calc( 100vh - 340px )',
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}

export default auditList;