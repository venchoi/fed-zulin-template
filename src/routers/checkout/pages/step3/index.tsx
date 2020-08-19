/**
 * 办理退租步骤页---- 第三步
 */
import React, { ReactElement } from 'react';
import { connect } from 'dva';
import { ProjectItemType, AssetSelectBaseType } from '../../types';
import '../index.less';

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

class AddCheckoutThree extends React.Component<AssetSelectProps, AssetsSelectStates> {
    constructor(props: AssetSelectProps) {
        super(props);
    }

    render(): ReactElement {
        return <div className="checkout-page-wrap three-page">退租第三步</div>;
    }
}

function mapStateToProps(state: any) {
    return {
        checkoutStep3: state.checkout.step3,
    };
}
export default connect(mapStateToProps)(AddCheckoutThree);
