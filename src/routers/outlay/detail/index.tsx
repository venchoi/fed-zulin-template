import React, { useState, useEffect } from 'react';
import { Breadcrumb, Card, Button, Col, Row, Divider, Table, PageHeader, Popover } from 'antd';

import './index.less';
import { ColumnProps } from 'antd/lib/table';
import FedUpload from '@c/FedUpload';
import { getOutLayDetail, getBillInfo } from '../service';
import { IOutlayDetail, IBillInfo, IBillInfoItem, IOutLayDetailItem } from '../type';
import { calcOutlayAmount } from '../provider';
import { comma } from '@/helper/commonUtils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { match } from 'react-router';
import config from '@/config';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { Link } from 'dva/router';

interface IProps {
    match: match<{ id: string }>;
}

const OutLayDetail = (props: IProps) => {
    const {
        match: {
            params: { id },
        },
    } = props;
    const [detail, setDetail] = useState<IOutlayDetail>({} as IOutlayDetail);
    const [billDetail, setBillDetail] = useState<IBillInfoItem>({} as IBillInfoItem);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDetail();
    }, []);

    const getDetail = async () => {
        const param = {
            id,
        };
        setLoading(true);
        const { data } = await getOutLayDetail(param);
        setDetail(data);
        const {
            data: { items = [] },
        } = await getBillInfo({ billId: data?.info?.exchange?.bill_id });
        setBillDetail(items[0]);
        setLoading(false);
    };

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

    const columns: ColumnProps<any>[] = [
        {
            title: '房间',
            render: (value, record: IOutLayDetailItem, index: number) => {
                const roomPackageName = record.package_name;
                const roomName = record.full_room_name;
                return (
                    <span title={roomPackageName || roomName}>
                        <span>{roomPackageName || roomName}</span>
                        {roomPackageName && (
                            <Popover
                                trigger="click"
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
            },
        },
        {
            dataIndex: 'fee_name',
            title: '费项',
        },
        {
            title: '费项周期',
            render: (value, record: IOutLayDetailItem, index: number) => {
                return <span>{`${record.start_date} 至 ${record.end_date}`}</span>;
            },
        },
        {
            dataIndex: 'amount',
            title: '本金(元)',
            align: 'right',
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{comma(value || '-')}</span>;
            },
        },
        {
            dataIndex: 'late_fee_amount',
            title: '滞纳金(元)',
            align: 'right',
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{comma(value || '-')}</span>;
            },
        },
        {
            dataIndex: 'fee',
            title: '手续费(元)',
            align: 'right',
            render: (value: string, record: IOutLayDetailItem, index: number) => {
                return <span>{comma(value || '-')}</span>;
            },
        },
    ];

    const getTableSummary = (pageData: IOutLayDetailItem[] = []) => {
        let amountTotal = 0;
        let lateFeeAmountTotal = 0;
        let feeTotal = 0;
        pageData.forEach(item => {
            amountTotal += +item.amount;
            lateFeeAmountTotal += +item.late_fee_amount;
            feeTotal += +item.fee;
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

    const routes = [
        {
            path: `/outlay/list`,
            breadcrumbName: '收支管理',
        },
        {
            path: '',
            breadcrumbName: '交易详情',
        },
    ];

    const itemRender = (route: Route) => {
        if (route.path) {
            return (
                <Link to={route.path} key={route.path}>
                    {route.breadcrumbName}
                </Link>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };

    const outlayAmount = calcOutlayAmount(detail?.items);

    const { info: { exchange, renter, stage } = { info: {} }, items = [] } = detail;
    const rentalName = renter?.type === '个人' ? renter?.name : renter?.organization_name;

    console.log('renter', renter);

    return (
        <div className="outlay-detail">
            <PageHeader
                className="page-header"
                title="交易详情"
                breadcrumb={{ routes, itemRender, separator: '>' }}
                extra={[
                    <Button type="primary" key="1">
                        开收据
                    </Button>,
                ]}
            ></PageHeader>
            <div className="content-box">
                <Card bordered={false} className="content" loading={loading}>
                    <h4>交易信息</h4>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>交易编号：</Col>
                        <Col span={21}>{exchange?.code || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>交易时间：</Col>
                        <Col span={21}>{exchange?.exchanged_on || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>交易对方：</Col>
                        <Col span={21}>{exchange?.exchanged_to_name || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>账单编号：</Col>
                        <Col span={21}>{billDetail?.bill?.code || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>账单月份：</Col>
                        <Col span={21}>{billDetail?.bill?.belong_date || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>合同：</Col>
                        <Col span={21}>{billDetail?.contract?.code || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>签署时间：</Col>
                        <Col span={21}>{billDetail?.contract?.sign_date || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>项目：</Col>
                        <Col span={21}>{stage?.name || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>租期：</Col>
                        <Col span={21}>{`${billDetail?.contract?.start_date || '-'} 至 ${
                            billDetail?.contract?.end_date
                        }`}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>租客：</Col>
                        <Col span={21}>
                            {renter?.type !== '个人'
                                ? `${rentalName}(${renter?.type})`
                                : `${renter?.name}/${renter?.mobile}(${renter})`}
                        </Col>
                    </Row>
                    {renter?.type !== '个人' && (
                        <Row gutter={[0, 16]}>
                            <Col span={3}>营业执照：</Col>
                            <Col span={21}>{renter?.organization_code || '-'}</Col>
                        </Row>
                    )}
                    <Row gutter={[0, 16]}>
                        <Col span={3}>{renter?.type === '企业' ? '法定代表人' : '经营者'}：</Col>
                        <Col span={21}>{renter?.name || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>联系人：</Col>
                        <Col span={21}>
                            {(renter?.attentions &&
                                renter.attentions[0] &&
                                renter.attentions.map(item => (
                                    <>
                                        <span>
                                            {item.name}/{item.mobile}
                                        </span>
                                        <br />
                                    </>
                                ))) ||
                                '-'}
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>经办人：</Col>
                        <Col span={21}>{exchange?.exchanged_by_name || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>{+outlayAmount.amountAll < 0 ? '退款' : '收款'}编号：</Col>
                        <Col span={21}>{exchange?.transaction_code || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>交易说明：</Col>
                        <Col span={21}>{exchange?.payment_remark || '-'}</Col>
                    </Row>
                    <Divider></Divider>
                    <h4>费用支付</h4>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>支付方式：</Col>
                        <Col span={21}>
                            {exchange?.payment_mode}
                            {exchange?.system_remark ? `(${detail.info.exchange.system_remark})` : ''}
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>{+outlayAmount.amountAll >= 0 ? '收款' : '退款'}账号：</Col>
                        <Col span={21}>
                            {exchange?.lessor_account
                                ? `${detail.info.exchange.lessor_bank}(${exchange?.lessor_account}/${exchange?.lessor_account_name}/${exchange?.lessor_name})`
                                : '-'}
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>{+outlayAmount.amountAll < 0 ? '收款' : '付款'}方：</Col>
                        <Col span={21}>{exchange?.exchanged_to_name || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>{+outlayAmount.amountAll < 0 ? '收款' : '付款'}账号：</Col>
                        <Col span={21}>
                            {exchange?.renter_account
                                ? `${exchange?.renter_account_name}(${exchange?.renter_bank}/${exchange?.renter_account})`
                                : '-'}
                        </Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>支付时间：</Col>
                        <Col span={21}>{exchange?.payment_time || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>支付单号</Col>
                        <Col span={21}>{exchange?.payment_no || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>说明：</Col>
                        <Col span={21}>{exchange?.payment_remark || '-'}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>收入合计(元)：</Col>
                        <Col span={21}>{comma(outlayAmount.inAll || '0')}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>支出合计(元)：</Col>
                        <Col span={21}>{comma(outlayAmount.outAll || '0')}</Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                        <Col span={3}>交易总额(元)：</Col>
                        <Col span={21}>{comma(outlayAmount.amountAll || '0')}</Col>
                    </Row>
                    <Divider></Divider>
                    <h4>交易明细</h4>
                    {Array.isArray(items) && (
                        <Table
                            columns={columns}
                            dataSource={items || []}
                            pagination={false}
                            summary={getTableSummary}
                            className="exchange-detail-table"
                        ></Table>
                    )}
                    <h4>相关附件</h4>
                    <FedUpload readonly files={exchange?.attachment || []}></FedUpload>
                </Card>
            </div>
        </div>
    );
};

export default OutLayDetail;
