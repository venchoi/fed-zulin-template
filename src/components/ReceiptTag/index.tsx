import React from 'react';
import { Popover, Row, Col, Button } from 'antd';
import { IReceipt } from '@/types/common';
import { comma } from '@/helper/commonUtils';

import './index.less';

interface IProps {
    data: IReceipt[];
}

const ReceiptTag = (props: IProps) => {
    const renderReceiptTagPopover = () => {
        const invoiceList = props.data || [];
        return (
            <div className="content">
                {invoiceList.map(item => (
                    <div className="invoice-item item" key={`${item.id}`}>
                        <Row gutter={[16, 8]}>
                            <Col span={7}>收据编号</Col>
                            <Col span={13}>{item.number || '-'}</Col>
                            <Col span={4}>
                                <a className="detail-btn" href={`/fed/receipt/detail/${item.id}`}>
                                    详情
                                </a>
                            </Col>
                        </Row>
                        <Row gutter={[16, 8]}>
                            <Col span={7}>收款人</Col>
                            <Col span={17}>{item.payee_name || ''}</Col>
                        </Row>
                        <Row gutter={[16, 8]}>
                            <Col span={7}>收款金额(元)</Col>
                            <Col span={17}>{comma(item.amount || '0')}</Col>
                        </Row>
                        <Row gutter={[16, 8]}>
                            <Col span={7}>开具时间</Col>
                            <Col span={17}>{item.receipt_time || '-'}</Col>
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
            overlayClassName="receipt-tag-popover"
            content={renderReceiptTagPopover()}
        >
            <span className="invoice-tag">据</span>
        </Popover>
    );
};

export default ReceiptTag;
