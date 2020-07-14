import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SearchArea from './components/renterListSearchArea';
import FedPagination from '@c/FedPagination';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { RenterListProps, renterListType } from './list.d';
import './renterList.less';

export const renterList = (props: RenterListProps) => {
    const [derateList, setDerateList] = useState([]);
    const columns: ColumnProps<renterListType>[]= [
        {
            dataIndex: 'code',
            title: '合同编号',
            width: 205,
            render: (text: string, record: renterListType, index: number) => {
                return (
                    <span title={text || '-'}>
                        {text || '-'}
                    </span>
                );
            },
        },
        {
            dataIndex: 'date',
            title: '租赁期限',
            width: 218,
            render: (text: string, record: renterListType, index: number) => {
                return (
                    <span title={text || '-'}>
                        {record.start_date} 至 {record.end_date}
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
                    <span className="derate-table-td-rs" title={renters[0]}>
                        {renters[0]}
                    </span>
                    <Popover title="全部承租方" placement="bottom" content={popoverContent}>
                        <InfoCircleOutlined
                            style={{
                                color: '#BEC3C7',
                                marginLeft: '5px',
                                marginTop: '4px',
                            }}
                        />
                    </Popover>
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
                    <span className="derate-table-td-rs" title={rooms[0].room_name || '-'}>
                        {rooms[0].room_name}
                    </span>
                    <Popover title="全部租赁资源" placement="bottom" content={popoverContent}>
                        <InfoCircleOutlined
                            style={{
                                color: '#BEC3C7',
                                marginLeft: '5px',
                                marginTop: '4px',
                            }}
                        />
                    </Popover>
                </div>
            },
        },
        {
            dataIndex: 'contract_status',
            title: '合同状态',
            width: 106,
            filters: [
                {
                    text: '待审核',
                    value: '待审核',
                },
                {
                    text: '审核中',
                    value: '审核中',
                },
                {
                    text: '已审核',
                    value: '已审核',
                },
                {
                    text: '执行中',
                    value: '执行中',
                },
                {
                    text: '已关闭',
                    value: '已关闭',
                },
            ],
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
    ];

    const handleTableChange = () => {

    }
    return (
        <div className="renter-list-page">
            <SearchArea />
            <FedTable<renterListType>
                className="renter-list-table"
                vsides={false}
                rowKey="id"
                columns={columns}
                dataSource={derateList}
                scroll={{
                    y: 'calc( 100vh - 340px )',
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}

export default renterList;