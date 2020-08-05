/**
 * 单价调整单详情页
 */
import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Button, Divider, Space, message, Spin, Popconfirm } from 'antd';
import { Route } from 'antd/es/breadcrumb/Breadcrumb.d';
import { IAdjustmentDetail, IAdjustmentICURDParams, PriceAdjustHandleType } from '@t/meter';
import { match } from 'react-router';
import { RouteComponentProps, Link } from 'dva/router';
import { getPriceAdjustmentDetail, postPrice } from '@/services/meter';
import BaseInfo from './components/adjustmentbaseInfo';
import './adjustmentDetail.less';
import { Status } from '@/types/meter';
interface IMatch extends match {
    params: {
        id: string;
    };
}

interface IProps extends RouteComponentProps {
    match: IMatch;
}
const AdjustmentDetail = ({
    match: {
        params: { id },
    },
}: IProps) => {
    const initDetail = {
        id: '',
        start_date: '',
        end_date: '',
        is_step: '',
        step_data: '[]',
        price: '',
        unit: '',
        status: Status.PENDING,
        created_on: '',
        code: '', // 调整单号
        reason: '', // 调整原因
        standard_name: '', // 单价名称
        meter_type_name: '', // 类型名称
        meter_standard_price_id: '', //
        type: '', // 类型
        attachment: '',
        audit_date: '', // 审核时间
        auditor_id: '', // 审核人id
        created_by: '', // 发起时间
        modified_on: '',
        modified_by: '',
        is_deleted: '',
        created_by_name: '', // 发起人
        auditor_id_name: '', // 审核人
    };
    const routes = [
        {
            path: '/metermg?tab=adjustment',
            breadcrumbName: '单价调整单',
        },
        {
            path: '',
            breadcrumbName: '调整单详情',
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
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<IAdjustmentDetail>(initDetail);
    const fetchDetail = async () => {
        setLoading(true);
        const { data } = await getPriceAdjustmentDetail({ id });
        setLoading(false);
        const result = data || initDetail;
        setDetail({ ...result, step_data: JSON.parse(result.step_data) });
    };
    const actionHandler = async (payload: IAdjustmentICURDParams) => {
        const { result } = await postPrice(payload);
        if (result) {
            message.success('操作成功');
            fetchDetail();
        }
    };
    useEffect(() => {
        fetchDetail();
    }, []);
    return (
        <>
            <PageHeader
                title={detail.standard_name || '调整单详情'}
                breadcrumb={{ routes, itemRender, separator: '>' }}
                ghost={false}
            />
            <div className="layout-detail adjustment-detail">
                <Spin spinning={loading}>
                    <Card className="layout-detail-tab-content">
                        <BaseInfo detail={detail} />
                        <Divider style={{ marginTop: '16px', padding: '0 16px' }} />
                        <footer style={{ padding: '16px 0' }}>
                            <Space>
                                {[Status.PENDING].includes(detail.status) ? (
                                    <Popconfirm
                                        title="确认审核该调整单?"
                                        onConfirm={() => {
                                            actionHandler({ type: PriceAdjustHandleType.AUDIT, id });
                                        }}
                                    >
                                        <Button type="primary">审核</Button>
                                    </Popconfirm>
                                ) : null}
                                {[Status.PENDING].includes(detail.status) ? (
                                    <Popconfirm
                                        title="确认作废该调整单？"
                                        onConfirm={() => actionHandler({ type: PriceAdjustHandleType.VOID, id })}
                                    >
                                        <Button>作废</Button>
                                    </Popconfirm>
                                ) : null}
                                {[Status.AUDITED].includes(detail.status) ? (
                                    <Popconfirm
                                        title="确认取消审核该调整单？"
                                        onConfirm={() => actionHandler({ type: PriceAdjustHandleType.CANCELAUDIT, id })}
                                    >
                                        <Button>取消审核</Button>
                                    </Popconfirm>
                                ) : null}
                            </Space>
                        </footer>
                    </Card>
                </Spin>
            </div>
        </>
    );
};
export default AdjustmentDetail;
