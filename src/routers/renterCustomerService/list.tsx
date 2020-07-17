import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge } from 'antd';
import { connect } from 'dva';
import TreeProjectSelect from '@c/TreeProjectSelect';
import ContentLayout from '@c/FedListPageLayout';
import RenterList from './renterList';
import AuditList from './auditList';
import FedPagination from '@c/FedPagination';
import AddAdminModal from './components/addAdminModal';
import { Props } from './list.d';
import { projsValue } from '@t/project';
import { getApplyListCount } from '@s/renterCustomerService';
import { renterListType } from './list.d';
import './list.less';

const { TabPane } = Tabs;

export const renterCustomerServiceList = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [auditNumber, setAuditNumber] = useState(0);
    const [totalSize, setTotalSize] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [page, setPage] = useState(1);
    const [stageId, setStageId] = useState('');
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [selectedProjectNames, setselectedProjectNames] = useState<string[]>([]); // 当前选中的项目
    const [isShowModal, setIsShowModal] = useState(false); // 是否显示新增/更改管理员弹窗
    const [currentRecord, setCurrentRecord] = useState<renterListType | undefined>();
    const [isRequestRenterList, setIsRequestRenterList] = useState(false);
    const [currentTab, setCurrentTab] = useState('租户管理员');

    const getUnauditStats = async () => {
        const params = {
            stage_id: selectedProjectIds.join(','),
            status: '待审核'
        }
        const { result, data } = await getApplyListCount(params);
        if (result && data) {
            setAuditNumber(data.total || 0);
        }
    }

    const handleTreeSelected = (selecctedProject: projsValue) => {
        setselectedProjectIds(selecctedProject.projIds);
        setselectedProjectNames(selecctedProject.projNames);
        setPage(1);
        setStageId(selecctedProject.projIds.join(','));
    };

    const handleShowAddAdminModal = (record?: renterListType) => {
        if(record && record.id) {
            setCurrentRecord(record);
            setIsShowModal(true);
        } else {
            setCurrentRecord(undefined);
            setIsShowModal(true);
        }
    }

    const handleCloseAdminModal = (isSuccess: boolean): void => {
        setIsShowModal(false);
        const tk = setTimeout(() => {
            setCurrentRecord(undefined);
            clearTimeout(tk);
        });
        if (isSuccess) {
            setIsRequestRenterList(!isRequestRenterList);
        }
    }

    const handleChangeTab = (tab: string) => {
        setPage(1);
        setCurrentTab(tab);
    }
    console.log(pageSize)
    const auditNumberTab = (<div className="audit-tab">
        <span>审核</span>
        {
            auditNumber > 0 ?  
            <span className={`audit-number ${auditNumber < 10 ? 'circle' : ''}`}>{ auditNumber }</span>
            :
            null
        }
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
                    {
                        currentTab === '租户管理员' ?
                        <Divider 
                            type="vertical" 
                            style={{
                                height: "28px",
                                margin: '0 16px'
                            }} 
                        />
                        :
                        null
                    }
                    {
                        currentTab === '租户管理员' ?
                        <Button type="primary" onClick={() => handleShowAddAdminModal()}>新增管理员</Button>
                        :
                        null
                    }
                </div>
            }
        >
            <div>
                <Tabs defaultActiveKey="租户管理员" animated={false} onChange={handleChangeTab}>
                    <TabPane tab="租户管理员" key="租户管理员" forceRender={true}>
                        {
                            currentTab === '租户管理员' ?
                            <RenterList 
                                page={page}
                                pageSize={pageSize}
                                totalSize={totalSize}
                                stageId={stageId}
                                requestRenterList={isRequestRenterList}
                                setLoading={setLoading} 
                                setTotalSize={setTotalSize}
                                handleShowAddAdminModal={handleShowAddAdminModal}
                                getUnauditStats={getUnauditStats}
                            />
                            :
                            null
                        }
                        
                    </TabPane>
                    <TabPane tab={auditNumberTab} key="审核">
                        {
                            currentTab === '审核' ?
                            <AuditList 
                                page={page}
                                pageSize={pageSize}
                                totalSize={totalSize}
                                stageId={stageId}
                                setLoading={setLoading} 
                                setTotalSize={setTotalSize}
                                getUnauditStats={getUnauditStats}
                            />
                            :
                            null
                        }
                        
                    </TabPane>
                </Tabs>
                {
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
                }
                <AddAdminModal 
                    isShowModal={isShowModal} 
                    record={currentRecord}
                    onClose={handleCloseAdminModal}
                    setLoading={setLoading}
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