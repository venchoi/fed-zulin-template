import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge } from 'antd';
import { connect } from 'dva';
import TreeProjectSelect from '@c/TreeProjectSelect';
import ContentLayout from '@c/FedListPageLayout';
import RenterList from './renterList';
import { Props } from './list.d';
import './list.less';

const { TabPane } = Tabs;

export const renterCustomerServiceList = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [auditNumber, setAuditNumber] = useState(33);

    const auditNumberTab = (<div className="audit-tab">
        <span>审核</span>
        <Badge count={auditNumber} style={{marginLeft: 4}} />
    </div>);
    return (
        <ContentLayout
            className="renter-customer-service-list-page"
            contentWrapperClassName="renter-customer-content-area"
            title="租户服务"
            isLoading={loading}
            isShowDivider={false}
            topRightSlot={
                <div className="project-select-area">
                    <TreeProjectSelect  width={312} />
                    <Divider type="vertical" style={{
                        height: "28px",
                        margin: '0 16px'
                    }} />
                    <Button type="primary">新增管理员</Button>
                </div>
            }
        >
            <Tabs defaultActiveKey="租户管理员">
                <TabPane tab="租户管理员" key="租户管理员">
                    <RenterList />
                </TabPane>
                <TabPane tab={auditNumberTab} key="审核">
                    
                </TabPane>
            </Tabs>
        </ContentLayout>
    );
}

function mapStateToProps(state: any) {
    return {
        user: state.main.user,
    };
}
export default connect(mapStateToProps)(renterCustomerServiceList);