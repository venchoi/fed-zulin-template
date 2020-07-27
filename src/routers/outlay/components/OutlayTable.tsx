import React, { useState, useEffect } from 'react';
import FedTable from '@/components/FedTable';
import FedPagination from '@/components/FedPagination';
import { OutLayTableProps, OutLayListItem, FeeItem, ExtPayment } from '@/types/outlay';
import { ColumnProps } from 'antd/lib/table';
import { Popover, Row, Col, Divider } from 'antd';
import FedIcon from '@/components/FedIcon';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'dva/router';
import config from '@/config';

import './OutlayTable.less';
import { isPlainObject } from 'lodash';

const OutLayTable = (props: OutLayTableProps) => {
    const renderExchangedToNamePopover = (record: OutLayListItem) => {
        const {
            type,
            bill_code,
            ext_bill,
            payment_remark,
            contract_code,
            stage_name,
            ext_contract,
            ext_renter,
        } = record;
        const rentalTypeName = type === '企业' ? '法定代表人' : '经营者';
        const rentalName = ext_renter.type === '个人' ? ext_renter.name : ext_renter.organization_name;
        const rentalNameDisplay = `${rentalName}${ext_renter.type === '个人' ? '/' + ext_renter.mobile : ''}(${
            ext_renter.type
        })`;
        return (
            <div>
                {bill_code && (
                    <Row gutter={[16, 8]}>
                        <Col span={7}>账单</Col>
                        <Col span={17}>{bill_code}</Col>
                    </Row>
                )}
                {bill_code && ext_bill && (
                    <Row gutter={[16, 8]}>
                        <Col span={7}>账单月份</Col>
                        <Col span={17}>{ext_bill.type === '周期' ? ext_bill.belong_date : ext_bill.type}</Col>
                    </Row>
                )}
                <Row gutter={[16, 8]}>
                    <Col span={7}>交易说明</Col>
                    <Col span={17}>{payment_remark}</Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Divider />
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={7}>合同</Col>
                    <Col span={17}>{contract_code}</Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={7}>所在项目</Col>
                    <Col span={17}>{stage_name}</Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={7}>签署时间</Col>
                    <Col span={17}>{isPlainObject(ext_contract) ? ext_contract.sign_date || '' : ''}</Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={7}>租期</Col>
                    <Col span={17}>
                        {isPlainObject(ext_contract) ? ext_contract.start_date || '' : ''}至
                        {isPlainObject(ext_contract) ? ext_contract.end_date || '' : ''}
                    </Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col span={7}>租客</Col>
                    <Col span={17}>{rentalNameDisplay}</Col>
                </Row>
                {ext_renter.type !== '个人' && (
                    <Row gutter={[16, 8]}>
                        <Col span={7}>{rentalTypeName}</Col>
                        <Col span={17}>
                            {ext_renter.name}/{ext_renter.mobile}
                        </Col>
                    </Row>
                )}
                <Row gutter={[16, 8]}>
                    <Col span={7}>联系人</Col>
                    <Col span={17}>
                        {ext_renter.attentions &&
                            ext_renter.attentions.map((at, index) => (
                                <span>
                                    {at.name}/{at.mobile}
                                    <br />
                                </span>
                            ))}
                    </Col>
                </Row>
            </div>
        );
    };

    const columns: ColumnProps<OutLayListItem>[] = [
        {
            dataIndex: 'code',
            title: '交易号',
            render: (code: string, record: OutLayListItem, index: number) => {
                const { full_room_name, payment_time, exchanged_on } = record;
                let exChangeDate = '--';
                if (exchanged_on) {
                    const arr = exchanged_on.split(' ');
                    if (arr && arr.length >= 0) {
                        exChangeDate = arr[0];
                    }
                }
                return (
                    <div>
                        <p>{code}</p>
                        {/* TODO 打包合同名称/楼栋 */}
                        <p>支付时间：{payment_time}</p>
                        <p>交易时间：{exChangeDate}</p>
                    </div>
                );
            },
        },
        {
            dataIndex: 'exchanged_to_name',
            title: '交易对方',
            render: (exchanged_to_name: string, record: OutLayListItem, index: number) => {
                const {
                    ext_renter: { name, type, organization_name },
                    ext_contract,
                    payment_mode,
                    proj_name,
                } = record;
                const rentalName = type === '个人' ? name : organization_name;
                const isShowPopover = ext_contract && rentalName && payment_mode !== '预存结转';
                return (
                    <div>
                        <p>
                            <span>{exchanged_to_name || '--'}</span>
                            {/* TODO 加content */}
                            <Popover
                                trigger="click"
                                placement="bottom"
                                className="popover"
                                overlayClassName="exchanged-to-name-popover"
                                content={renderExchangedToNamePopover(record)}
                            >
                                <ExclamationCircleOutlined style={{ color: '#BEC3C7' }} />
                            </Popover>
                        </p>
                        <p>项目：{proj_name}</p>
                    </div>
                );
            },
        },
        {
            dataIndex: 'fee_items',
            title: '费项',
            render: (fee_items: FeeItem[], record: OutLayListItem, index: number) => {
                const feeItemName = Array.isArray(fee_items) && fee_items.map(fee => fee.fee_name).join();
                const { payment_mode, system_remark } = record;
                const remark = system_remark ? system_remark : '';
                return (
                    <div>
                        <p>{feeItemName}</p>
                        <p>
                            {payment_mode}
                            {remark}
                        </p>
                    </div>
                );
            },
        },
        {
            dataIndex: 'lessor_name',
            title: '甲方名称',
            render: (text: string) => {
                return <span>{text || '--'}</span>;
            },
        },
        {
            dataIndex: 'lessor_account_name',
            title: '收款方账号',
            render: (text: string) => {
                return <span>{text || '--'}</span>;
            },
        },
        {
            dataIndex: 'ext_payment',
            title: '收入(元)',
            render: (ext_payment: ExtPayment[], record: OutLayListItem, index: number) => {
                let inPay = '--';
                if (Array.isArray(ext_payment)) {
                    ext_payment.forEach(item => {
                        if (+item.amount >= 0) {
                            inPay = item.amount;
                        }
                    });
                }

                return (
                    <p>
                        {inPay}
                        {/* TODO 加content */}
                        <Popover trigger="click" placement="bottom" className="popover">
                            <ExclamationCircleOutlined style={{ color: '#BEC3C7' }} />
                        </Popover>
                    </p>
                );
            },
        },
        {
            dataIndex: '',
            title: '支出(元)',
            render: (ext_payment: ExtPayment[], record: OutLayListItem, index: number) => {
                let outPay = '--';
                if (Array.isArray(ext_payment)) {
                    ext_payment.forEach(item => {
                        if (+item.amount <= 0) {
                            outPay = item.amount;
                        }
                    });
                }

                return (
                    <p>
                        {outPay}
                        {/* TODO 加content */}
                        <Popover trigger="click" placement="bottom" className="popover">
                            <ExclamationCircleOutlined style={{ color: '#BEC3C7' }} />
                        </Popover>
                    </p>
                );
            },
        },
        {
            dataIndex: '',
            title: '交易总额(元)',
            render: (exchanged_amount: string) => {
                // TODO 加千分分隔符
                const amount = Math.abs(+exchanged_amount || 0).toFixed(2);
                let operator = '';
                if (+exchanged_amount > 0) {
                    operator = '+';
                } else if (+exchanged_amount < 0) {
                    operator = '-';
                }
                return (
                    <div>
                        <span>{operator}</span>
                        <span>{amount}</span>
                    </div>
                );
            },
        },
        {
            title: '操作',
            render: (text: string, record: OutLayListItem, index: number) => {
                const { id, fee_items, proj_id } = record;
                const {
                    extData: { canApplyInvoice },
                } = props;
                const hasReceipt =
                    fee_items && fee_items.length > 0 && fee_items[0].receipt && fee_items[0].receipt.length > 0;
                const hasInvoice = fee_items && fee_items.some(feeItem => feeItem.can_invoicing === 1);
                return (
                    <div>
                        {!(hasReceipt || hasInvoice) && (
                            <a
                                className="operate-btn"
                                href={`/fed/receipt/invoice?exchange_ids=${id}&stage_id=${proj_id}`}
                            >
                                开收据
                            </a>
                        )}
                        {!canApplyInvoice && hasInvoice && <a className="operate-btn">开发票</a>}
                        {canApplyInvoice && hasInvoice && <a className="operate-btn">申请开票</a>}
                        <Link className="operate-btn" to={`${config.baseAlias}/outlay/detail/${id}`}>
                            详情
                        </Link>
                    </div>
                );
            },
        },
    ];

    return (
        <div data-component="outlay-table">
            <FedTable
                rowKey="id"
                columns={columns}
                dataSource={props.outlayList}
                scroll={{
                    y: 'calc( 100vh - 340px )',
                }}
            />
            <FedPagination
                onShowSizeChange={(current, page_size) => {
                    props.onPageSizeChange({ page_size });
                }}
                onChange={(page_index, page_size) => {
                    props.onPageChange({ page: page_index, page_size: page_size || 10 });
                }}
                current={props.page}
                pageSize={props.pageSize}
                showTotal={total => `共${Math.ceil(+total / +(props.pageSize || 1))}页， ${total}条记录`}
                total={+props.outlayListTotal}
            />
        </div>
    );
};

export default OutLayTable;
