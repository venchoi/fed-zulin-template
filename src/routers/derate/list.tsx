import React, { useState, useEffect } from 'react';
import { Card, Button, Table, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { ColumnProps } from 'antd/es/table';
import { History } from 'history';
import ContentLayout from './components/contentLayout';
import SearchArea from './components/SearchArea';
import TreeProjectSelect from '@c/TreeProjectSelect';
import FedTable from '@c/FedTable';
import FedPagination from '@c/FedPagination';
import { fetchMuiltStageWorkflowTempIsEnabled, getDerateList } from '@s/derate';
import { formatNum, comma, checkPermission } from '../../helper/commonUtils';
import { getDerateListParams } from '../../types/derateTypes';
import './list.less';

interface User {
    account: string;
    displayName: string;
    display_name: string;
    key: string;
    org_id: string;
    organ_name: string;
    tenantCode: string;
    tenant_code: string;
    tenant_name: string;
    user_id: string;
}

interface Props {
    history: History;
    user: User;
}

export interface projsValue {
    projIds: Array<string>;
    projNames: Array<string>;
}

export interface feeItem {
    full_room_name: string;
    fee_name: string;
}
export interface derateType {
    id: string;
    code: string;
    items: feeItem[];
    created_on: string;
    fee_names: string;
    derated_amount: string | number;
    demurrage_derated_amount: string | number;
    status: string;
    proj_id: string;
    wh_approval_info: any;
    workflow_instance_id: string;
    show_third_detail: string | number;
    wh_new_approval_info: any;
    wh_renew_approval_info: any;
    created_by: string;
}

export interface statusMapType {
    [index: string]: string;
}

export interface responseType {
    status?: boolean;
    msg?: string;
    data?: any[];
}

export interface enableItemType {
    isEnabled: boolean;
    oaName: string;
    oaId: string;
    gotIsEnabled: boolean;
    projId: string;
}

const baseAlias = 'static';
export const DerateList = (props: Props) => {
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [searchParams, setsearchParams] = useState<getDerateListParams>({
        proj_id: '',
        keyword: '',
        page: 1,
        page_size: 10,
    }); // 减免列表搜索参数
    const [derateTotal, setderateTotal] = useState(0);
    const [derateList, setderateList] = useState([]); // 减免列表
    const [enableList, setenableList] = useState<enableItemType[]>([]); // 减免列表

    useEffect(() => {
        getDerateListData();
    }, []);

    const handleTreeSelected = (selecctedProject: projsValue) => {
        setselectedProjectIds(selecctedProject.projIds);
        getDerateListData();
    };

    const setIsEnabledList = (json: responseType = {}, scenarioCode: string) => {
        const list = json.data || [];
        const enableList = list.map(item => ({
            isEnabled: item[scenarioCode].third_oa_name ? false : item[scenarioCode], //返回true  或者 第三方对象 { third_oa_name 审批流名称   }
            oaName: item[scenarioCode].third_oa_name,
            oaId: item[scenarioCode].third_oa_id,
            gotIsEnabled: true,
            projId: item.proj_id,
        }));
        setenableList(enableList);
    };

    const getWorkflowStatus = (projIdStr: string) => {
        fetchMuiltStageWorkflowTempIsEnabled({
            proj_id: projIdStr,
            scenario_code: 'derated_apply',
        }).then(res => {
            if (!res.result) {
                message.error(res.msg);
                return;
            }
            const data = res;
            setIsEnabledList(data, 'derated_apply');
        });
    };

    const getDerateListData = () => {
        getDerateList(searchParams).then(res => {
            console.log(res);
            console.log(res.data.items);
            if (!res.result) {
                message.error(res.msg);
                return;
            }
            if (res.data) {
                setderateList(res.data.items || []);
                setderateTotal(res.data.total);
            }
        });
    };

    const getVal = (projId: string, key: string) => {
        const match: any = enableList.find(item => item.projId === projId);
        if (match) {
            return match[key];
        }
        return false;
    };

    const handleOaAudit = (record: derateType) => {};

    const fetchOaDetail = (record: derateType) => {};

    const handleAudit = (id: string) => {};

    const handleVoid = (id: string) => {};

    const handleCancelDerate = (id: string) => {};

    const run = (type: string, rowData: derateType, e?: React.MouseEvent) => {
        e && e.stopPropagation();
        switch (type) {
            case 'workflow': {
                let wx_url =
                    (rowData.wh_new_approval_info && rowData.wh_new_approval_info.detail_url) ||
                    (rowData.wh_renew_approval_info && rowData.wh_renew_approval_info.detail_url);
                if (wx_url) {
                    window.open(wx_url);
                } else {
                    setTimeout(
                        () =>
                            props.history.push(`${baseAlias}/workflowApproval/detail/${rowData.workflow_instance_id}`),
                        20
                    );
                }
                break;
            }
            case 'approval': {
                let scenarioCode = 'derated_apply';
                const params = {
                    scenario_code: scenarioCode,
                    project_id: rowData.proj_id,
                    business_id: rowData.id,
                };
                // this.setState({
                //     workflow: {
                //         showModal: true,
                //         params,
                //         actions,
                //         errorTips: this.showErr,
                //         callBack: (json) => {
                //             console.log('json', json);
                //             this.setState({
                //                 workflow: {
                //                     showModal: false,
                //                     params: null,
                //                     actions: null,
                //                     errorTips: null,
                //                     callBack: null
                //                 }
                //             }, () => {
                //                 console.log('json', json);
                //                 if (json.result && json.data === 'wh_approval') {
                //                     //
                //                 }
                //                 if (json && json.data === 'original_approval') {
                //                     setTimeout(() => this.context.router.push(`${baseAlias}/workflowApproval/add/${rowData.proj_id}/${rowData.id}/${scenarioCode}`), 20);
                //                 }
                //             })
                //         }
                //     }
                // })
                break;
            }
        }
    };

    // 两个表格相同的列，除操作列
    const columns: ColumnProps<derateType>[] = [
        {
            dataIndex: 'code',
            title: '减免流水号',
            width: 168,
            render: (text, record, index) => {
                return <span>{text}</span>;
            },
        },
        {
            dataIndex: 'proj_name',
            title: '项目名称',
            width: 120,
            render: (text, record, index) => {
                return <>{text || '-'}</>;
            },
        },
        // {
        //     dataIndex: 'desc',
        //     title: '租客',
        //     width: 136,
        //     render: text => {
        //         return <>{text || '-'}</>;
        //     },
        // },
        {
            dataIndex: 'items',
            title: '资源',
            width: 144,
            render: (text, record: derateType, index) => {
                const items = record.items;
                const resource = items.length > 0 ? items[0].full_room_name : '';
                return <>{resource || '-'}</>;
            },
        },
        {
            dataIndex: 'created_on',
            title: '申请日期',
            width: 112,
            render: (text, record: derateType) => {
                const createdOn = record.created_on && record.created_on.replace(/(.*)\s.*/, '$1');
                return <>{createdOn || '-'}</>;
            },
        },
        {
            dataIndex: 'fee_item',
            title: '减免费项',
            width: 112,
            render: (text, record: derateType, index) => {
                let feeName: any = Array.from(new Set(record.items.map(bill => bill.fee_name)));
                feeName = feeName.join(',');
                return <>{feeName || '-'}</>;
            },
        },
        {
            dataIndex: 'derated_amount',
            title: '减免金额',
            width: 162,
            render: (text, record: derateType, index) => {
                const derated_amount = +record.derated_amount;
                const demurrage_derated_amount = +record.demurrage_derated_amount;
                const totalDerate = comma(formatNum(derated_amount + demurrage_derated_amount));
                return <>{totalDerate || '-'}</>;
            },
        },
        {
            dataIndex: 'apply_by_name',
            title: '发起人',
            width: 96,
        },
        {
            dataIndex: 'status',
            title: '状态',
            width: 96,
            render: (text, record: derateType, index) => {
                const statusMap: statusMapType = {
                    待审核: 'unaudit',
                    审核中: 'auditing',
                    已减免: 'audited',
                    已作废: 'deleted',
                };
                return (
                    <div className="status-item">
                        <span className={`icon-dot ${statusMap[text]}`}></span>
                        <span className="status-text">{text}</span>
                    </div>
                );
            },
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render(text, record: derateType) {
                const { user } = props;
                const stageId = record.proj_id;
                const oaName = getVal(record.proj_id, 'oaName');
                const isEnabled = getVal(record.proj_id, 'isEnabled');
                const gotIsEnabled = getVal(record.proj_id, 'gotIsEnabled');
                const startApprovalPermission = checkPermission(
                    'EstablishWorkflowApproval',
                    'rental-establishworkflowapproval-start-approval'
                );
                let approvalText = '提交审批';
                if (record && record.wh_approval_info) {
                    if (record.wh_approval_info.status === '待重新发起') {
                        approvalText = '重新提交审批';
                    }
                }
                return (
                    <div>
                        {record.status === '待审核' &&
                        !oaName &&
                        isEnabled &&
                        (user.user_id === record.created_by || startApprovalPermission) ? (
                            <Button
                                type="link"
                                className="operate-btn"
                                onClick={
                                    record.workflow_instance_id
                                        ? run.bind(this, 'workflow', record)
                                        : run.bind(this, 'approval', record)
                                }
                            >
                                {approvalText}
                            </Button>
                        ) : null}
                        {record.status === '待审核' && oaName && user.user_id === record.created_by ? (
                            <Button
                                type="link"
                                className="link-btn f-hidden rental-derate-audit"
                                onClick={handleOaAudit.bind(this, record)}
                                style={{ marginRight: '5px' }}
                            >
                                提交审批
                            </Button>
                        ) : null}
                        {record.workflow_instance_id && record.status !== '待审核' ? (
                            <Link
                                className="link-btn f-hidden rental-derate-view"
                                to={`${baseAlias}/workflowApproval/detail/${record.workflow_instance_id}`}
                                style={{ marginRight: '5px' }}
                            >
                                审批详情
                            </Link>
                        ) : null}
                        {record.status === '审核中' && +record.show_third_detail === 1 ? (
                            <a className="operate-btn" onClick={fetchOaDetail.bind(this, record)}>
                                审批详情
                            </a>
                        ) : null}
                        {record.status === '待审核' && !isEnabled && !oaName ? (
                            <Button
                                type="link"
                                className="link-btn f-hidden rental-derate-audit"
                                onClick={handleAudit.bind(this, record.id)}
                                style={{ marginRight: '5px' }}
                            >
                                审核
                            </Button>
                        ) : null}
                        {record.status === '待审核' ? (
                            <Button
                                type="link"
                                className="link-btn f-hidden rental-derate-void"
                                onClick={handleVoid.bind(this, record.id)}
                                style={{ marginRight: '5px' }}
                            >
                                作废
                            </Button>
                        ) : null}
                        {record.status === '待审核' ? (
                            <Link
                                className="link-btn f-hidden rental-derate-edit"
                                to={`${baseAlias}/derate/edit/${record.id}?type=edit`}
                                style={{ marginRight: '5px' }}
                            >
                                修改
                            </Link>
                        ) : null}
                        {record.status === '已减免' ? (
                            <Button
                                type="link"
                                className="link-btn f-hidden rental-derate-unaudit"
                                onClick={handleCancelDerate.bind(this, record.id)}
                                style={{ marginRight: '5px' }}
                            >
                                取消减免
                            </Button>
                        ) : null}
                        {record.status !== '待审核' && record.wh_approval_info && record.wh_approval_info.detail_url ? (
                            <a
                                className="operate-btn"
                                target="_blank"
                                href={record.wh_approval_info && record.wh_approval_info.detail_url}
                            >
                                审批详情
                            </a>
                        ) : null}
                        <Link
                            className="link-btn f-hidden rental-derate-view"
                            to={`${baseAlias}/derate/detail/${record.id}`}
                            style={{ marginRight: '5px' }}
                        >
                            详情
                        </Link>
                    </div>
                );
            },
        },
    ];

    return (
        <ContentLayout
            className="derate-list-page"
            title="减免管理"
            topRightSlot={
                <div className="project-select-area">
                    <TreeProjectSelect onTreeSelected={handleTreeSelected} width={312} />
                </div>
            }
        >
            <div>
                <SearchArea />
                <FedTable<derateType>
                    vsides={false}
                    rowKey="id"
                    columns={columns}
                    dataSource={derateList}
                    rowSelection={{
                        type: 'checkbox',
                    }}
                    scroll={{
                        y: 'calc( 100vh - 340px )',
                    }}
                />
                <FedPagination
                    onShowSizeChange={(current, page_size) => {
                        setsearchParams({ page: 1, page_size });
                    }}
                    onChange={(page_index, page_size) => {
                        setsearchParams({ page: page_index, page_size: page_size || 10 });
                    }}
                    current={searchParams.page}
                    pageSize={searchParams.page_size}
                    showTotal={total => `共${Math.ceil(+total / +(searchParams.page_size || 1))}页， ${total}条记录`}
                    total={+derateTotal}
                />
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
