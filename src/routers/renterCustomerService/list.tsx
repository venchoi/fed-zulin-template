import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge } from 'antd';
import { connect } from 'dva';
import TreeProjectSelect from '@c/TreeProjectSelect';
import ContentLayout from '@c/FedListPageLayout';
import RenterList from './renterList';
import AuditList from './auditList';
import FedPagination from '@c/FedPagination';
import { Props } from './list.d';
import { projsValue } from '@t/project';
import './list.less';

const { TabPane } = Tabs;

export const renterCustomerServiceList = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [auditNumber, setAuditNumber] = useState(0);
    const [totalSize, setTotalSize] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [stageId, setStageId] = useState('');
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [selectedProjectNames, setselectedProjectNames] = useState<string[]>([]); // 当前选中的项目

    const handleTreeSelected = (selecctedProject: projsValue) => {
        setselectedProjectIds(selecctedProject.projIds);
        setselectedProjectNames(selecctedProject.projNames);
        setPage(1);
        setStageId(selecctedProject.projIds.join(','));
    };

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
                    <TreeProjectSelect onTreeSelected={handleTreeSelected} width={312} />
                    <Divider type="vertical" style={{
                        height: "28px",
                        margin: '0 16px'
                    }} />
                    <Button type="primary">新增管理员</Button>
                </div>
            }
        >
            <div>
                <Tabs defaultActiveKey="租户管理员" animated={false}>
                    <TabPane tab="租户管理员" key="租户管理员" forceRender={true}>
                        <RenterList 
                            page={page}
                            pageSize={pageSize}
                            totalSize={totalSize}
                            stageId={stageId}
                            setLoading={setLoading} 
                            setTotalSize={setTotalSize}
                        />
                    </TabPane>
                    <TabPane tab={auditNumberTab} key="审核">
                        <AuditList 
                            page={page}
                            pageSize={pageSize}
                            totalSize={totalSize}
                            stageId={stageId}
                            setLoading={setLoading} 
                            setTotalSize={setTotalSize}
                        />
                    </TabPane>
                </Tabs>
                <FedPagination
                    wrapperClassName="renter-list-pagination"
                    onShowSizeChange={(current, page_size) => {
                        setPage(1);
                        setPageSize(page_size);
                    }}
                    onChange={(page_index, page_size) => {
                        setPage(page_index);
                        setPageSize(page_size || 0);
                    }}
                    current={page}
                    pageSize={pageSize}
                    showTotal={total => `共${Math.ceil(+total / +(pageSize || 1))}页， ${total}条记录`}
                    total={+totalSize}
                />
            </div>
        </ContentLayout>
    );
}

function mapStateToProps(state: any) {
    return {
        user: state.main.user,
    };
}
export default connect(mapStateToProps)(renterCustomerServiceList);