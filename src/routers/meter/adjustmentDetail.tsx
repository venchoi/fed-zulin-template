import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Button, Divider, Space } from 'antd';
import { Route } from 'antd/es/breadcrumb/Breadcrumb.d';
import { IAdjustmentDetail } from '@t/meter';
import { match } from 'react-router';
import { RouteComponentProps } from 'dva/router';
import { getPriceAdjustmentDetail } from '@/services/meter';
import BaseInfo from './components/baseInfoAdjustment';
import './adjustmentDetail.less';
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
        step_data: '',
        price: '',
        unit: '',
        status: '',
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
            path: '',
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
                <a href={route.path} key={route.path}>
                    {route.breadcrumbName}
                </a>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };
    const [detail, setDetail] = useState<IAdjustmentDetail>(initDetail);
    const fetchDetail = async () => {
        const { data } = await getPriceAdjustmentDetail({ id });
        setDetail(data || initDetail);
    };
    useEffect(() => {
        fetchDetail();
    }, []);
    return (
        <>
            <PageHeader
                title={detail.standard_name || '调整单详情'}
                breadcrumb={{ routes, itemRender }}
                ghost={false}
            />
            <div className="layout-list">
                <Card>
                    <div style={{ padding: '16px 24px 0  24px' }}>
                        <BaseInfo detail={detail} />
                    </div>
                    <Divider style={{ marginTop: '16px' }} />
                    <footer className="footer">
                        <Space>
                            <Button type="primary">审核</Button>
                            <Button>作废</Button>
                        </Space>
                    </footer>
                </Card>
            </div>
        </>
    );
};
export default AdjustmentDetail;
