import React from 'react';
import { Divider, Button, Tabs, Badge, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { RenterListProps, renterListType, statusMapType, auditListType } from './list.d';
import { ColumnProps } from 'antd/es/table';

export const basicRenterListColumns:  ColumnProps<renterListType>[] = [
    {
        dataIndex: 'code',
        title: '合同编号',
        fixed: 'left',
        width: 205,
        render: (text: string, record: renterListType, index: number) => {
            return (
                <span  className="contract-code-td renter-table-td" title={text}>
                    {`${text}(${record.version})`}
                </span>
            );
        },
    },
    {
        dataIndex: 'date',
        title: '租赁期限',
        width: 218,
        render: (text: string, record: renterListType, index: number) => {
            const date = `${record.start_date} 至 ${record.end_date}`
            return (
                <span title={date} className="renter-table-td">
                    {date}
                </span>
            );
        },
    },
    {
        dataIndex: 'renter',
        title: '承租方',
        width: 228,
        render: (text: string, record: renterListType, index: number) => {
            const renters = record.contract_renter.map(item =>
                `${item.alias}方: ${item.organization_name}`
            )
            const popoverContent = renters.map(renter => <p>{renter}</p>);
            return <div className="rs-td-container">
                <span className="renter-table-td-rs" title={renters[0]}>
                    {renters[0]}
                </span>
                {
                    renters.length > 1 ?
                    <Popover 
                        title="全部承租方" 
                        placement="bottom"
                        overlayClassName="renter-list-popover" 
                        content={popoverContent}
                    >
                        <InfoCircleOutlined
                            style={{
                                color: '#BEC3C7',
                                marginLeft: '5px',
                                marginTop: '4px',
                            }}
                        />
                    </Popover>
                    :
                    null
                }
                
            </div>
        },
    },
    {
        dataIndex: 'rooms',
        title: '租赁资源',
        width: 230,
        render: (text: string, record: renterListType, index: number) => {
            const rooms = record.contract_room;
            const popoverContent = (
                <div>
                    {rooms.map(room => {
                        return <p>{room.room_name}</p>;
                    })}
                </div>
            );
            return <div className="rs-td-container">
                <span className="renter-table-td-rs" title={rooms[0].room_name || '-'}>
                    {rooms[0].room_name}
                </span>
                {
                    rooms.length > 1 ?
                    <Popover
                        title="全部租赁资源"
                        placement="bottom"
                        overlayClassName="renter-list-popover"
                        content={popoverContent} 
                    >
                        <InfoCircleOutlined
                            style={{
                                color: '#BEC3C7',
                                marginLeft: '5px',
                                marginTop: '4px',
                            }}
                        />
                    </Popover>
                    :
                    null
                }
            </div>
        },
    },
    {
        dataIndex: 'contract_status',
        title: '合同状态',
        width: 106,
        render: (text: string, record: renterListType, index: number) => {
            const statusMap: statusMapType = {
                待审核: 'unaudit',
                审核中: 'auditing',
                已审核: 'audited',
                执行中: 'processing',
                已关闭: 'closed'
            };
            return (
                <div className="status-item">
                    <span className={`icon-dot ${statusMap[text]}`}></span>
                    <span className="status-text">{text}</span>
                </div>
            );
        },
    },
    {
        dataIndex: 'admin_user_name',
        title: '管理员',
        width: 94,
        render: (text: string, record: renterListType, index: number) => {
            return (
                <span className="renter-table-td" title={record.admin_user_name}>
                    {record.admin_user_name}
                </span>
            );
        },
    },
    {
        dataIndex: 'phone',
        title: '管理员联系方式',
        width: 147,
        render: (text: string, record: renterListType, index: number) => {
            return (
                <span className="renter-table-td" title={record.phone}>
                    {record.phone}
                </span>
            );
        },
    },
    {
        dataIndex: 'email',
        title: '管理员邮箱',
        width: 147,
        render: (text: string, record: renterListType, index: number) => {
            return (
                <span className="renter-table-td" title={record.email}>
                    {record.email}
                </span>
            );
        },
    },
    {
        dataIndex: 'gap',
        title: ''
    },
]

export const basicAuditListColumns:  ColumnProps<auditListType>[] = [
    {
        dataIndex: 'created_on',
        title: '申请时间',
        width: 205,
        render: (text: string, record: auditListType, index: number) => {
            return (
                <span  className="renter-table-td" title={text || '-'}>
                    {text || '-'}
                </span>
            );
        },
    },
    {
        dataIndex: 'code',
        title: '合同编号',
        width: 205,
        render: (text: string, record: auditListType, index: number) => {
            return (
                <span  className="contract-code-td renter-table-td" title={text || '-'}>
                    {text || '-'}
                </span>
            );
        },
    },
    {
        dataIndex: 'stage_name',
        title: '项目名称',
        width: 200,
        render: (text: string, record: auditListType, index: number) => {
            return (
                <span className="derate-table-td" title={text || '-'}>
                    {text || '-'}
                </span>
            );
        },
    },
    {
        dataIndex: 'rooms',
        title: '租赁资源',
        width: 230,
        render: (text: string, record: auditListType, index: number) => {
            const rooms = record.contract_room;
            const popoverContent = (
                <div>
                    {rooms.map(room => {
                        return <p>{room.room_name}</p>;
                    })}
                </div>
            );
            return <div className="rs-td-container">
                <span className="renter-table-td-rs" title={rooms[0].room_name || '-'}>
                    {rooms[0].room_name}
                </span>
                {
                    rooms.length > 1 ?
                    <Popover
                        title="全部租赁资源"
                        placement="bottom"
                        overlayClassName="renter-list-popover"
                        content={popoverContent} 
                    >
                        <InfoCircleOutlined
                            style={{
                                color: '#BEC3C7',
                                marginLeft: '5px',
                                marginTop: '4px',
                            }}
                        />
                    </Popover>
                    :
                    null
                }
            </div>
        },
    },
    {
        dataIndex: 'apply_user_name',
        title: '申请人',
        width: 94,
        render: (text: string, record: auditListType, index: number) => {
            return (
                <span className="renter-table-td" title={record.apply_user_name}>
                    {record.apply_user_name}
                </span>
            );
        },
    },
    {
        dataIndex: 'master_phone',
        title: '申请人手机',
        width: 147,
        render: (text: string, record: auditListType, index: number) => {
            return (
                <span className="renter-table-td" title={record.master_phone || '--'}>
                    {record.master_phone || '--'}
                </span>
            );
        },
    },
    {
        dataIndex: 'origin_master_name',
        title: '原管理员',
        width: 94,
        render: (text: string, record: auditListType, index: number) => {
            return (
                <span className="renter-table-td" title={record.origin_master_name || '--'}>
                    {record.origin_master_name || '--'}
                </span>
            );
        },
    },
    {
        dataIndex: 'origin_master_phone',
        title: '原管理员手机',
        width: 147,
        render: (text: string, record: auditListType, index: number) => {
            return (
                <span className="renter-table-td" title={record.origin_master_phone || '--'}>
                    {record.origin_master_phone || '--'}
                </span>
            );
        },
    },
    {
        dataIndex: 'status',
        title: '状态',
        width: 120,
        render: (text: string, record: auditListType, index: number) => {
            const statusMap: statusMapType = {
                待审核: 'unaudit',
                已审核: 'audited',
                审核不通过: 'passed'
            };
            return (
                <div className="status-item">
                    <span className={`icon-dot ${statusMap[text]}`}></span>
                    <span className="status-text">{text}</span>
                </div>
            );
        },
    },
    {
        dataIndex: 'gap',
        title: ''
    },
]