/**
 * 办理退租步骤页---- 第一步
 */
import React, { ReactElement } from 'react';
import { connect } from 'dva';
import { PageHeader, Tabs, Card, Tag, Divider } from 'antd';
import { Route } from 'antd/es/breadcrumb/Breadcrumb';
import { Link } from 'dva/router';
import CheckoutHeader from '../../components/checkoutHeader';
import CheckoutStepBar from '../../components/stepBar';
import PageModuleHeader from '../../components/pageModuleHeader';
import ShowContractTable from './components/contractShowTable';
import { ProjectItemType, AssetSelectBaseType } from '../../types';
import './pages.less';

type AssetSelectProps = {
    actions: {
        fetchBuildingTreeList: (params: any, cb: any) => void | null;
        fetchList: (params: any, cb: any) => void | null;
    };
} & AssetSelectBaseType;

type AssetsSelectStates = {
    projectSelectedList: Array<ProjectItemType>;
    projectId: string;
    buildingObj: {
        type: string;
        id: string;
    };
    current: number;
};

class AddCheckoutOne extends React.Component<AssetSelectProps, AssetsSelectStates> {
    constructor(props: AssetSelectProps) {
        super(props);
    }

    state: AssetsSelectStates = {
        projectSelectedList: [], // 缓存选中的项目列表
        projectId: '', // 当前选中的项目ID
        buildingObj: { type: '', id: '' }, // {type: 'floor', id: id}当前选择的楼栋结构
        current: 1,
    };

    render(): ReactElement {
        return (
            <>
                <CheckoutHeader />
                <div className="layout-detail checkout-page-wrap">
                    <div className="one-page">
                        <CheckoutStepBar />
                        <Divider className="checkout-page-divider" />
                        <div className="content-wrap">
                            <PageModuleHeader title="合同信息" />
                            <ShowContractTable />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        checkoutOne: state.checkout.one,
    };
}
export default connect(mapStateToProps)(AddCheckoutOne);
