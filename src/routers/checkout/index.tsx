/**
 * 办理退租列表
 */
import React, { ReactElement } from 'react';
import { connect } from 'dva';
import { ProjectItemType, AssetSelectBaseType } from './types';
import './list.less';

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

interface ICheckout {
    one: {};
}

class AddCheckoutList extends React.Component<AssetSelectProps, AssetsSelectStates> {
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
        return <div className="checkout-page-wrap one-page">退租列表</div>;
    }
}
export default connect(checkout => {
    checkoutOne: checkout && checkout.one;
})(AddCheckoutList);
