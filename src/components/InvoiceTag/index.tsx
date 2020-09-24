import React from 'react';
import { Popover, Row, Col, Button } from 'antd';
import { reduce } from 'lodash';
import { IInvoice } from '@/types/common';
import { comma } from '@/helper/commonUtils';

import './index.less';

interface IProps {
    data: IInvoice[];
}

const InvoiceTag = (props: IProps) => {
    const renderInvoiceTagPopover = () => {
        const invoiceList = props.data || [];
        return (
            <div className="content">
                {invoiceList.map(item => (
                    <div className="invoice-item item" key={`${item.id}`}>
                        <Row gutter={[0, 8]}>
                            <Col span={7}>票据编号</Col>
                            <Col span={14}>{item.number || '-'}</Col>
                            <Col span={3}>
                                <a className="detail-btn" href={`/fed/invoice/detail/${item.id}`}>
                                    详情
                                </a>
                            </Col>
                        </Row>
                        <Row gutter={[0, 8]}>
                            <Col span={7}>票据类型</Col>
                            <Col span={17}>{item.type_name || ''}</Col>
                        </Row>
                        <Row gutter={[0, 8]}>
                            <Col span={7}>开票金额(元)</Col>
                            <Col span={17}>{comma(item.amount || '0')}</Col>
                        </Row>
                        <Row gutter={[0, 8]}>
                            <Col span={7}>开票时间</Col>
                            <Col span={17}>{item.receipt_date || '-'}</Col>
                        </Row>
                        <Row gutter={[0, 8]}>
                            <Col span={7}>开票人</Col>
                            <Col span={17}>{item.receipt_by_name || '-'}</Col>
                        </Row>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Popover
            trigger="click"
            placement="bottom"
            className="popover"
            overlayClassName="invoice-tag-popover"
            content={renderInvoiceTagPopover()}
        >
            <span className="receipt-tag">票</span>
        </Popover>
    );
};

export default InvoiceTag;
