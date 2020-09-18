import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import * as queryString from 'query-string';
import { message, Button, Modal, Table } from 'antd';
import { ExclamationCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import ContentLayout from '@c/FedListPageLayout';
import SearchArea from './components/searchArea';
import TreeProjectSelect from '@c/TreeProjectSelect';
import FedPagination from '@c/FedPagination';
import DerateTable from './components/derateTable';
import WorkflowApprovalPopover from './components/workflowPopover';

import { getDerateList, batchAuditDerate, getBillItemFee, auditAll, getAuditStatus } from '@s/derate';
import { getDerateListParams } from '@/types/derateTypes';
import { Props, derateType, billFeeItemType, callbackFn, IAllAuditErrorMsg } from './list.d';
import { projsValue } from '@t/project';
import './list.less';
const baseAlias = 'static';
const { confirm } = Modal;
export const DerateList = (props: Props) => {
    const { user, history } = props;
    const queryStr = (location.search || '').replace(/^\?(.*)/, '$1');
    const query = queryString.parse(queryStr);
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [selectedProjectNames, setselectedProjectNames] = useState<string[]>([]); // 当前选中的项目
    const [searchParams, setsearchParams] = useState<getDerateListParams>({
        proj_id: '',
        keyword: query.keyword || '',
        page: 1,
        page_size: 20,
        start_date: '',
        end_date: '',
        fee_name: '',
        room_id: '',
        subdistrict_id: '',
        building_id: '',
        floor_id: '',
        floor_name: '',
        status: [],
        stage_id: '',
    }); // 减免列表搜索参数
    const [derateTotal, setderateTotal] = useState(0);
    const [waitAuditedTotal, setWaitAuditedTotal] = useState(0);
    const [derateList, setderateList] = useState([]); // 减免列表
    const [loading, setloading] = useState(false);
    const [selectedRowKeys, setselectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setselectedRows] = useState<derateType[]>([]);
    const [feeItemList, setFeeItemList] = useState<billFeeItemType[]>([]);
    const [workflow, setWorkflow] = useState({
        showModal: false, //显示弹框
        params: null, //所需参数
        callBack: undefined, // 弹框操作回调函数
    });
    const [allAuditErrorMsg, setAllAuditErrorMsg] = useState<IAllAuditErrorMsg>({} as IAllAuditErrorMsg);
    const [allAuditErrorModalVisible, setAllAuditErrorModalVisible] = useState(false);
    const tableSetLoading = useCallback(setloading, [setloading]);
    const configWorkflow = useCallback(setWorkflow, [setWorkflow]);
    useEffect(() => {
        getDerateListData();
    }, [searchParams]);

    useEffect(() => {
        getBillItemFeeList();
    }, [searchParams.proj_id]);

    const handleTreeSelected = (selecctedProject: projsValue) => {
        setselectedProjectIds(selecctedProject.projIds);
        setselectedProjectNames(selecctedProject.projNames);
        setsearchParams({
            ...searchParams,
            page: 1,
            proj_id: selecctedProject.projIds.join(','),
        });
    };

    const getDerateListData = async () => {
        let params = Object.assign({}, searchParams);
        // 项目搜索值来自于表头筛选还是项目选择器
        params.proj_id = params.stage_id ? params.stage_id : params.proj_id;
        if (!params.proj_id) {
            return;
        }
        params.proj_id;
        if (searchParams.subdistrict_id === '未分区') {
            params.subdistrict_id = '';
        }
        setloading(true);
        const { result, data } = await getDerateList(params);
        if (result && data) {
            setderateList(data.items || []);
            setderateTotal(data.total);
            setWaitAuditedTotal(data.waitAuditedTotal);
        }
        // 搜索后清空选中
        setselectedRowKeys([]);
        setselectedRows([]);
        setloading(false);
    };

    const getBillItemFeeList = async () => {
        if (!searchParams.proj_id) {
            return;
        }
        setloading(true);
        const { result, data } = await getBillItemFee({
            proj_id: searchParams.proj_id,
        });
        if (result) {
            setFeeItemList(
                data.map((item: { fee_name: string }) => {
                    return {
                        text: item.fee_name,
                        value: item.fee_name,
                    };
                }) || []
            );
        }
        setloading(false);
    };

    const handleTableSelect = (selectedRowKeys: string[], selectedRows: derateType[]) => {
        setselectedRows(selectedRows);
        setselectedRowKeys(selectedRowKeys);
    };

    const handleCancelSelect = () => {
        setselectedRows([]);
        setselectedRowKeys([]);
    };

    const handleAuditAll = async () => {
        const auditParams = {
            proj_ids: selectedProjectIds.join(','),
            type: '减免批量审核',
        };
        setloading(true);
        const { result, data } = await auditAll(auditParams);
        if (result && data) {
            const tk = setInterval(async () => {
                const { result, data } = await getAuditStatus(auditParams);
                if (!result) {
                    setloading(false);
                    clearInterval(tk);
                }
                if (data[0] && data[0].status === '失败') {
                    setloading(false);
                    setAllAuditErrorModalVisible(true);
                    setAllAuditErrorMsg(JSON.parse(data[0].msg || ''));
                    clearInterval(tk);
                }
                if (data[0] && data[0].status === '成功') {
                    setloading(false);
                    clearInterval(tk);
                    message.success('全部审核完成');
                    getDerateListData();
                }
            }, 2000);
        } else {
            setloading(false);
        }
    };

    const handleBatchAudit = (isAll: boolean | undefined) => (e: React.MouseEvent) => {
        const ids = selectedRowKeys;
        e.stopPropagation();
        const title = isAll ? '确定审核全部的记录？' : '确定审核选中的记录？';
        confirm({
            icon: <ExclamationCircleOutlined />,
            title,
            centered: true,
            onOk: async () => {
                if (isAll) {
                    handleAuditAll();
                    return;
                }
                setloading(true);
                const { result, msg = '操作失败', data } = await batchAuditDerate({ ids });
                setloading(false);
                if (result) {
                    setselectedRowKeys([]);
                    getDerateListData();
                    message.success('操作成功');
                } else {
                    // message.error(msg);
                }
            },
        });
    };

    const handleKeywordSearch = (value: string) => {
        setsearchParams({
            ...searchParams,
            keyword: value,
            page: 1,
        });
    };

    return (
        <ContentLayout
            className="derate-list-page"
            title="减免管理"
            isLoading={loading}
            topRightSlot={
                <div className="project-select-area">
                    <TreeProjectSelect onTreeSelected={handleTreeSelected} width={312} />
                </div>
            }
        >
            <div>
                <SearchArea
                    keywordValue={searchParams.keyword || ''}
                    selectedRowKeys={selectedRowKeys}
                    total={+waitAuditedTotal}
                    onAudit={handleBatchAudit}
                    onKeywordSearch={handleKeywordSearch}
                />
                <DerateTable
                    derateList={derateList}
                    derateTotal={derateTotal}
                    history={history}
                    user={user}
                    selectedRowKeys={selectedRowKeys}
                    onTableSelect={handleTableSelect}
                    projIds={selectedProjectIds}
                    projNames={selectedProjectNames}
                    setLoading={tableSetLoading}
                    getDerateListData={getDerateListData}
                    searchParams={searchParams}
                    setSearchParams={setsearchParams}
                    feeItemList={feeItemList}
                    configWorkflow={configWorkflow}
                />
                {/* {selectedRowKeys.length > 0 ? (
                    <div className="selected-status-bar">
                        <span className="text">
                            已选：<span className="selected-num">{selectedRowKeys.length}</span>条 减免单
                        </span>
                        <Button type="link" onClick={handleCancelSelect}>
                            取消已选
                        </Button>
                    </div>
                ) : null} */}
                <FedPagination
                    wrapperClassName="derate-list-pagination"
                    onShowSizeChange={(current, page_size) => {
                        setsearchParams({ ...searchParams, page: 1, page_size });
                    }}
                    onChange={(page_index, page_size) => {
                        setsearchParams({ ...searchParams, page: page_index, page_size: page_size || 10 });
                    }}
                    current={searchParams.page}
                    pageSize={searchParams.page_size}
                    showTotal={total => `共${Math.ceil(+total / +(searchParams.page_size || 1))}页， ${total}条记录`}
                    total={+derateTotal}
                />
                {workflow.showModal ? (
                    <WorkflowApprovalPopover params={workflow.params} callBack={workflow.callBack} />
                ) : null}

                <Modal
                    visible={allAuditErrorModalVisible}
                    title="审核结果"
                    width={690}
                    wrapClassName="all-audit-error-modal"
                    centered={true}
                    onCancel={() => setAllAuditErrorModalVisible(false)}
                    footer={[
                        <Button type="primary" onClick={() => setAllAuditErrorModalVisible(false)}>
                            我知道了
                        </Button>,
                    ]}
                >
                    <p>
                        审核成功{allAuditErrorMsg.title?.success_count}条，失败{allAuditErrorMsg.title?.fail_count}条
                    </p>
                    <Table
                        size="small"
                        columns={[
                            { dataIndex: 'code', width: 240, title: '减免流水号' },
                            { dataIndex: 'error_msg', title: '失败原因', ellipsis: true },
                        ]}
                        dataSource={allAuditErrorMsg.list}
                        pagination={false}
                        bordered={true}
                        scroll={{ y: 228 }}
                    />
                </Modal>
            </div>
        </ContentLayout>
    );
};

function mapStateToProps(state: any) {
    return {
        user: state.main.user,
    };
}
export default connect(mapStateToProps)(DerateList);
