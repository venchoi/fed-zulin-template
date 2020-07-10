/**
 * 资产持有人详情页
 */
import React, { useState, useEffect } from 'react';
import { PageHeader, Tabs, Card, Tag } from 'antd';
import { RouteComponentProps, Link } from 'dva/router';
import { Route } from 'antd/es/breadcrumb/Breadcrumb.d';
import { IAddAssetHolder, IAddAssetHolderBank } from '@t/assetHolder';
import { ENABLE } from '@t/common';
import { match } from 'react-router';
import BaseInfo from './components/baseInfo';
import AdjustmentRecord from './components/adjustmentRecord';
import { getAssetHolderDetail, getAssetHolderBankList } from '@/services/assetHolder';
import './detail.less';

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
        name: '', // 姓名
        short_name: '', // 简称
        id_code_type: '', // 证件类型
        id_code: '', // 证件号码
        english_name: '', // 英文姓名
        english_short_name: '', // 英文简称
        type: '', // 租客类型(个人,工商个体,企业)
        contacter: '', // 联系人
        mobile: '', // 电话号码
        address: '', // 地址
        project_id: '', // 关联项目 多个项目用,分隔
        manager: '', // 负责人  【与产品经理确认过，此处的负责人为单选】
    };
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<IAddAssetHolder>(initDetail);
    const [accountList, setAccountList] = useState<IAddAssetHolderBank[]>([]);
    const routes = [
        {
            path: '/asset-holder/list',
            breadcrumbName: '租入管理',
        },
        {
            path: '',
            breadcrumbName: '资产持有人详情',
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
    const fetchDetail = async () => {
        setLoading(true);
        const { data } = await getAssetHolderDetail({ id });
        setLoading(false);
        const result = data || initDetail;
        setDetail(result);
    };

    const fetchAccountData = async () => {
        setLoading(true);
        const { data } = await getAssetHolderBankList({ page: 1, page_size: 10000 });
        setLoading(false);
        const result = (data && data) || initDetail;
        setAccountList(result);
        console.log('result', result);
    };

    useEffect(() => {
        fetchDetail();
        fetchAccountData();
    }, []);

    return (
        <>
            <PageHeader
                title={detail.name || '...'}
                breadcrumb={{ routes, itemRender, separator: '>' }}
                ghost={false}
                subTitle={<Tag color="#87CFFF">企业</Tag>}
            />
            <div className="layout-detail standard-detail">
                <Tabs type="card">
                    <TabPane tab="详细信息" key="1">
                        <Card bordered={false} loading={loading} className="layout-detail-tab-content">
                            <BaseInfo detail={detail} account={accountList} />
                        </Card>
                    </TabPane>
                    <TabPane tab="合作记录" key="2">
                        <Card bordered={false} loading={loading} className="layout-detail-tab-content">
                            <AdjustmentRecord id={detail.id} />
                        </Card>
                    </TabPane>
                </Tabs>
            </div>
        </>
    );
};
export default Detail;
