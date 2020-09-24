import React, { useState, useEffect } from 'react';
import { Card, Button, Col, Row, Divider, Table, PageHeader, Popover, message } from 'antd';

import './index.less';
import FedUpload from '@c/FedUpload';
import { getOutLayDetail, getBillInfo } from '../service';
import { IOutlayDetail, IBillInfoItem, IRenter } from '../type';
import { calcOutlayAmount } from '../provider';
import { comma, getReportHref } from '@/helper/commonUtils';
import { match } from 'react-router';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import DetailExchangeTable from '../components/DetailExchangeTable';

interface IProps {
    match: match<{ id: string }>;
    location: Location;
    history: History;
}

const OutLayDetail = (props: IProps) => {
    const {
        match: {
            params: { id },
        },
        location,
        history,
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
        if (data?.info?.exchange?.bill_id) {
            const {
                data: { items = [] },
            } = await getBillInfo({ billId: data?.info?.exchange?.bill_id });
            setBillDetail(items[0]);
        }
        setLoading(false);
    };

    const routes: Route[] = [
        {
            path: '',
            breadcrumbName: '收支管理',
        },
        {
            path: '',
            breadcrumbName: '交易详情',
        },
    ];

    if (location.pathname.includes('deduction-detail')) {
        routes.push({ path: '', breadcrumbName: '抵扣详情' });
    }

    const itemRender = (route: Route, params: any, routes: Array<Route>, paths: Array<String>) => {
        const index = routes.findIndex(item => item.breadcrumbName === route.breadcrumbName);
        const goBackIndex = index - routes.length + 1;

        console.log('===goBackIndex', goBackIndex);
        if (goBackIndex < 0) {
            return (
                <a key={route.path} onClick={() => history.go(index - routes.length + 1)}>
                    {route.breadcrumbName}
                </a>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };

    const outlayAmount = calcOutlayAmount(detail?.items);

    const { info: { exchange, renter, stage } = { info: {} }, items = [] } = detail;
    const rentalName = renter?.type === '个人' ? renter?.name : renter?.organization_name;

    const getShowRentalName = (rentalName: string | undefined, renter: IRenter) => {
        let result = '-';
        if (renter?.type !== '个人') {
            if (rentalName) {
                result = rentalName;
            }
        } else {
            if (renter?.name) {
                result = renter.name;
            }
            if (renter?.mobile) {
                result += `/${renter.mobile}`;
            }
        }
        if (renter?.type) {
            result += `(${renter.type})`;
        }
        return result;
    };

    console.log('outlayAmount', outlayAmount);

    const getPageHeaderExtra = () => {
        const nodes = [];
        let hasReceipt = false;
        let canReceipt = items[0]?.can_receipt === 1;
        if (Array.isArray(items) && items[0]?.receipt?.length > 0) {
            hasReceipt = true;
        }
        if (hasReceipt) {
            nodes.push(
                <Button type="primary" key="1" onClick={handlePrintData}>
                    打印收据
                </Button>
            );
        }
        if (canReceipt && stage?.id && exchange?.id && +outlayAmount.amountAll > 0) {
            nodes.push(
                <Button
                    className="f-hidden rental-receipt-add-receipt"
                    type="primary"
                    key="2"
                    onClick={handleWriteOutReceipt}
                >
                    开收据
                </Button>
            );
        }
        return nodes;
    };

    // 打印数据
    const handlePrintData = () => {
        if (stage?.print_template_id) {
            const params = {
                id: stage.print_template_id,
                exchange_ids: `'${id}'`, // ''不能去掉
            };
            const url = getReportHref(params);
            window.open(url, '_blank');
        } else {
            message.error('未设置打印模板');
        }
    };

    // 开票据
    const handleWriteOutReceipt = () => {
        window.location.href = `/fed/receipt/invoice?exchange_ids=${exchange?.id}&stage_id=${stage?.id}`;
    };

    return (
        <div className="outlay-detail">
            <PageHeader
                className="page-header"
                title="交易详情"
                breadcrumb={{ routes, itemRender, separator: '>' }}
                extra={getPageHeaderExtra()}
            ></PageHeader>
            <div className="content-box">
                <Card bordered={false} className="content" loading={loading}>
                    {/******************** 交易信息 ********************/}
                    <div>
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
                            <Col span={21}>
                                {billDetail?.contract?.start_date
                                    ? `${billDetail.contract.start_date} 至 ${billDetail?.contract?.end_date || '-'}`
                                    : '-'}
                            </Col>
                        </Row>
                        <Row gutter={[0, 16]}>
                            <Col span={3}>租客：</Col>
                            <Col span={21}>{getShowRentalName(rentalName, renter as IRenter)}</Col>
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
                                    renter.attentions.map((item, index) => (
                                        <div key={`${index}`}>
                                            {item.name}/{item.mobile}
                                        </div>
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
                    </div>
                    <Divider></Divider>
                    {/******************** 费用支出 ********************/}
                    <div>
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
                    </div>
                    <Divider></Divider>
                    {/******************** 交易明细 ********************/}
                    <DetailExchangeTable exchange={exchange} items={items} />
                    {/******************** 相关附件 ********************/}
                    <div className="attachment-block">
                        <h4>相关附件</h4>
                        <FedUpload readonly files={exchange?.attachment || []}></FedUpload>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OutLayDetail;
