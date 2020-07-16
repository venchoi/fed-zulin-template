import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge, Popconfirm } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import AuditSearchArea from './components/auditListSearchArea';
import FedPagination from '@c/FedPagination';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { basicAuditListColumns } from './listComponent';
import { getAuditList } from '@s/renterCustomerService';
import AuditDetailModal from './components/auditDetailModal';
import { AuditListProps, auditListType, auditParamsType } from './list.d';
import {
    getAuditListParams
} from '@/types/renterCustomerService';
import './auditList.less';

export const auditList = (props: AuditListProps) => {
    const { setLoading, setTotalSize, page, pageSize, stageId, getUnauditStats } = props;
    const [auditList, setRenterList] = useState<auditListType[]>([]);
    const [searchParams, setsearchParams] = useState<getAuditListParams>({
        stage_id: '',
        keyword: '',
        page: 1,
        page_size: 10,
        status: ''
    });
    const [isShowModal, setIsShowModal] = useState(false); // 是否显示详情弹窗
    const [currentRecord, setCurrentRecord] = useState<auditListType>();
    const [isAudit, setIsAudit] = useState(false);

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
        getUnauditStats();
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

    const handleShowAuditModal = (record: auditListType, isAudit?: boolean) => (e: React.MouseEvent):void => {
        setIsAudit(!!isAudit);
        setCurrentRecord(record);
        setIsShowModal(true)
    }

    const handleCloseModal = (isNeedFetchAuditList: boolean) => {
        setIsShowModal(false)
        if (isNeedFetchAuditList) {
            getRenterCustomerList();
        }
    }

    const handleSearch = (value: auditParamsType) => {
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
                            <Button
                                type="link"
                                className="operate-btn f-hidden renter-customers-service-audit"
                                onClick={handleShowAuditModal(record, true)}
                            >
                                审核
                            </Button>
                            :
                            null
                    }
                    {
                        record.status === '已审核' ?
                            <Button
                                type="link"
                                className="operate-btn f-hidden renter-customers-service-audit"
                                onClick={handleShowAuditModal(record)}
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
            />
             <AuditDetailModal 
                isShowModal={isShowModal} 
                record={currentRecord}
                isAudit={isAudit}
                onClose={handleCloseModal}
                setLoading={setLoading}
            />
        </div>
    );
}

export default auditList;