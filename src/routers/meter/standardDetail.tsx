import React, { useState, useEffect } from 'react';
import { PageHeader, Tabs, Card } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { Route } from 'antd/es/breadcrumb/Breadcrumb.d';
import { IStandardPriceDetail } from '@t/meter';
import { ENABLE } from '@t/common';
import { match } from 'react-router';
import StatusComponent from './components/statusComponent';
import BaseInfo from './components/baseInfo';
import AdjustmentRecord from './components/adjustmentRecord';
import { getStandardPriceDetail } from '@/services/meter';
import './standardDetail.less';

const { TabPane } = Tabs;
interface IMatch extends match {
    params: {
        id: string;
    };
}

interface IProps extends RouteComponentProps {
    match: IMatch;
}

const Detail = ({
    match: {
        params: { id },
    },
}: IProps) => {
    const initDetail = {
        id: '',
        meter_type_name: '', // 类型名称
        is_enabled: ENABLE.NOTENABLED, // 是否启用
        name: '', // 名称
        meter_type_id: '', // 类型id
        is_step: '', // 是否阶梯价
        step_data: '', //
        price: '', // 单价
        unit: '', // 单位
        remark: '', // 说明
        effect_date: '', // 生效时间
        created_on: '', // 创建时间
        created_by: '', // 创建人
        modified_on: '', // 修改时间
        modified_by: '', // 修改人
        is_deleted: '',
        created_by_name: '',
    };
    const [detail, setDetail] = useState<IStandardPriceDetail>(initDetail);
    const routes = [
        {
            path: '',
            breadcrumbName: '标准单价管理',
        },
        {
            path: '',
            breadcrumbName: '标准详情',
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
    const fetchDetail = async () => {
        const { data } = await getStandardPriceDetail({ id });
        setDetail((data.id && data) || initDetail);
    };
    useEffect(() => {
        fetchDetail();
    }, []);

    return (
        <>
            <PageHeader
                title={detail.name || '标准详情'}
                breadcrumb={{ routes, itemRender }}
                ghost={false}
                subTitle={<StatusComponent is_enabled={detail.is_enabled} />}
            />
            <div className="layout-list">
                <Tabs type="card">
                    <TabPane tab="基本信息" key="1">
                        <Card bordered={false} style={{ padding: '20px 16px' }}>
                            <BaseInfo detail={detail} />
                        </Card>
                    </TabPane>
                    <TabPane tab="调整记录" key="2">
                        <Card bordered={false} style={{ padding: '20px 16px' }}>
                            <AdjustmentRecord id={detail.id} />
                        </Card>
                    </TabPane>
                </Tabs>
            </div>
        </>
    );
};
export default Detail;
