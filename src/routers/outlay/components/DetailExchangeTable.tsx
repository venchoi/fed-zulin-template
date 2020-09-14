import React from 'react';
import { Table, Popover } from 'antd';
import { IExchange, IOutLayDetailItem, IOutLayDetailItemObj } from '../type';
import { ColumnProps } from 'antd/lib/table';
import { comma } from '@/helper/commonUtils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import config from '@/config';
import { getExchangeList } from '../provider';

import './DetailExchangeTable.less';

interface IProps {
    exchange: IExchange | undefined;
    items: IOutLayDetailItem[] | IOutLayDetailItemObj;
}

const DetailExchangeTable = (props: IProps) => {
    const { exchange, items } = props;

    const columns: ColumnProps<IOutLayDetailItem>[] = [
        {
            title: '房间',
            ellipsis: true,
            render: (value, record: IOutLayDetailItem, index: number) => {
                return renderRoom(record);
            },
        },
        {
            dataIndex: 'fee_name',
            title: '费项',
            ellipsis: true,
            render: text => {
                return <span title={text}>{text || '-'}</span>;
            },
        },
        {
            title: '费项周期',
            width: 240,
            render: (value, record: IOutLayDetailItem, index: number) => {
                return <span>{record.start_date ? `${record.start_date} 至 ${record.end_date}` : '-'}</span>;
            },
        },
        {
            dataIndex: 'amount',
            title: '本金(元)',
            align: 'right',
            width: 180,
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{comma(value || '-')}</span>;
            },
        },
        {
            dataIndex: 'late_fee_amount',
            title: '滞纳金(元)',
            align: 'right',
            width: 180,
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{comma(value || '-')}</span>;
            },
        },
        {
            dataIndex: 'fee',
            title: '手续费(元)',
            align: 'right',
            width: 180,
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{comma(value || '-')}</span>;
            },
        },
    ];

    const columns2: ColumnProps<any>[] = [
        {
            title: '房间',
            ellipsis: true,
            width: 160,
            render: (value, record: IOutLayDetailItem, index: number) => {
                return renderRoom(record);
            },
        },
        {
            dataIndex: 'renter_name',
            title: '租客',
            ellipsis: true,
            width: 160,
            render: (text: string) => {
                return <span title={text}>{text || '-'}</span>;
            },
        },
        {
            dataIndex: 'fee_name',
            title: '费项',
            ellipsis: true,
            width: 200,
            render: (text: string, record: IOutLayDetailItem) => {
                let feeName = '';
                let remark = '';
                if (record.transference?.type) {
                    if (record.transference.type === '账单') {
                        feeName = `应收${record.transference.type}`;
                    } else {
                        feeName = record.transference.type;
                        remark = text ? `(${text})` : '';
                    }
                }
                return (
                    <span title={(feeName ? feeName : text) + remark}>
                        {feeName ? feeName : text}
                        <span className="c-text-gray">{remark}</span>
                    </span>
                );
            },
        },
        {
            dataIndex: 'transference_type',
            title: '折扣方式',
            ellipsis: true,
            width: 220,
            render: (text: string) => {
                return <span title={text}>{text || '-'}</span>;
            },
        },
        {
            dataIndex: 'amount',
            title: '收入(元)',
            align: 'right',
            width: 180,
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{+value > 0 ? comma(value) : '-'}</span>;
            },
        },
        {
            dataIndex: 'amount',
            title: '支出(元)',
            align: 'right',
            width: 180,
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{+value < 0 ? comma(value) : '-'}</span>;
            },
        },
        {
            title: '费项周期',
            width: 240,
            render: (value, record: IOutLayDetailItem, index: number) => {
                return <span>{record.start_date ? `${record.start_date} 至 ${record.end_date}` : '-'}</span>;
            },
        },
        {
            title: '操作',
            width: 140,
            fixed: 'right',
            render: (text: string, record: IOutLayDetailItem, index: number) => {
                return (
                    <span>
                        {record.from_exchange_id ? (
                            <a href={`${config.baseAlias}/outlay/deduction-detail/${record.from_exchange_id}`}>
                                抵扣详情
                            </a>
                        ) : (
                            '-'
                        )}
                    </span>
                );
            },
        },
    ];

    const renderRentalResourcePopover = (record: IOutLayDetailItem) => {
        const roomNames = record?.full_room_name?.split(',') || [];
        return (
            <div className="content">
                {roomNames.map((roomName, index) => (
                    <p title={roomName} key={`${index}`}>
                        {roomName}
                    </p>
                ))}
            </div>
        );
    };

    const renderRoom = (record: IOutLayDetailItem) => {
        const roomPackageName = record.package_name;
        const roomName = record.full_room_name;
        return (
            <span title={roomPackageName || roomName}>
                <span>{roomPackageName || roomName}</span>
                {roomPackageName && (
                    <Popover
                        trigger="hover"
                        placement="bottom"
                        className="popover"
                        overlayClassName="rental-resource-popover"
                        title={roomPackageName}
                        content={renderRentalResourcePopover(record)}
                    >
                        <ExclamationCircleOutlined style={{ color: '#BEC3C7' }} />
                    </Popover>
                )}
            </span>
        );
    };

    const renderTableSummary = (pageData: IOutLayDetailItem[] = []) => {
        let amountTotal = 0;
        let lateFeeAmountTotal = 0;
        let feeTotal = 0;
        pageData.forEach(item => {
            amountTotal += +item.amount || 0;
            lateFeeAmountTotal += +item.late_fee_amount || 0;
            feeTotal += +item.fee || 0;
        });
        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} className="summary-title">
                        合计(元)
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="summary-money">
                        {comma(amountTotal.toFixed(2))}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} className="summary-money">
                        {comma(lateFeeAmountTotal.toFixed(2))}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} className="summary-money">
                        {comma(feeTotal.toFixed(2))}
                    </Table.Summary.Cell>
                </Table.Summary.Row>
            </>
        );
    };

    const renderTableSummary2 = (pageData: IOutLayDetailItem[] = []) => {
        let incomeTotal = 0;
        let expendTotal = 0; // 支出合计
        if (pageData.length === 1) {
            if (+pageData[0].amount > 0) {
                incomeTotal = +pageData[0].amount;
            } else {
                expendTotal = +pageData[0].amount;
            }
        } else if (pageData.length === 2) {
            incomeTotal = +pageData[1].amount;
            expendTotal = +pageData[0].amount;
        }

        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} className="summary-title">
                        合计(元)
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="summary-money">
                        {comma(incomeTotal.toFixed(2))}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} className="summary-money">
                        {comma(expendTotal.toFixed(2))}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} colSpan={2} className="summary-money"></Table.Summary.Cell>
                </Table.Summary.Row>
            </>
        );
    };

    return (
        <div className="detail-exchange-table">
            <h4>交易明细</h4>
            {Array.isArray(items) && (
                <Table
                    rowKey="id"
                    columns={exchange?.type !== '结转' ? columns : columns2}
                    dataSource={exchange?.type !== '结转' ? items || [] : getExchangeList(items)}
                    pagination={false}
                    summary={exchange?.type !== '结转' ? renderTableSummary : renderTableSummary2}
                    size="small"
                    bordered
                    className="exchange-detail-table"
                    scroll={{ x: 1300 }}
                ></Table>
            )}
        </div>
    );
};

export default DetailExchangeTable;
