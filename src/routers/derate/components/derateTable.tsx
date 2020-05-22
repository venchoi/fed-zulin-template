import React, { useState, useEffect } from 'react';
import { Card, Button, Table, message } from 'antd';
import DerateSubRow from './derateSubRow';
import { Link } from 'dva/router';
import { ColumnProps } from 'antd/es/table';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { History } from 'history';
import FedTable from '@c/FedTable';
import { fetchMuiltStageWorkflowTempIsEnabled, getDerateList } from '@s/derate';
import { formatNum, comma, checkPermission } from '@/helper/commonUtils';
import { User, projsValue, feeItem, derateType, statusMapType, responseType, enableItemType } from '../list.d';

interface derateTableProps {
    derateList: derateType[];
    derateTotal: number;
    user: User;
    history: History;
    selectedRowKeys: string[];
    onTableSelect?(keys: string[], rows: derateType[]): void;
    projIds: string[];
}

interface selectedRowKeyType {
    id: string;
}

const baseAlias = 'static';
export const DerateTable = (props: derateTableProps) => {
    const { derateList, derateTotal, user, history, onTableSelect, selectedRowKeys } = props;
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [enableList, setenableList] = useState<enableItemType[]>([]); // 减免列表

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

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: any, selectedRows: derateType[]) => {
            onTableSelect && onTableSelect(selectedRowKeys, selectedRows);
        },
        getCheckboxProps: (record: derateType) => {
            const oaName = getVal(record.proj_id, 'oaName');
            const isEnabled = getVal(record.proj_id, 'isEnabled');
            return {
                disabled: oaName || isEnabled || record.status !== '待审核', // Column configuration not to be checked
            };
        },
    };

    const expandable = {
        expandIconColumnIndex: 1,
        expandRowByClick: true,
        expandedRowRender: (record: derateType) => {
            return <DerateSubRow record={record} />;
        },
        rowExpandable: (record: derateType) => {
            return true;
        },
        expandIcon: ({ expanded, onExpand, record }: any): JSX.Element => {
            return expanded ? (
                <div className="expandable-col">
                    <DownOutlined onClick={e => onExpand(record, e)} />
                </div>
            ) : (
                <div className="expandable-col">
                    <RightOutlined onClick={e => onExpand(record, e)} />
                </div>
            );
        },
    };

    useEffect(() => {
        const projStr = props.projIds ? props.projIds.join(',') : '';
        getWorkflowStatus(projStr);
    }, [props.projIds.join(',')]);

    const columns: ColumnProps<derateType>[] = [
        {
            dataIndex: 'code',
            title: '减免流水号',
            width: 168,
            render: (text: string, record: derateType, index: number) => {
                return <span>{text}</span>;
            },
        },
        {
            dataIndex: 'proj_name',
            title: '项目名称',
            width: 120,
            render: (text: string, record: derateType, index: number) => {
                return <>{text || '-'}</>;
            },
        },
        {
            dataIndex: 'renter_organization_names',
            title: '租客',
            width: 136,
            render: (text: string, record: derateType, index: number) => {
                let renterOrganizationNames = record.items.map(bill => bill.renter_organization_name);
                renterOrganizationNames = [...new Set(renterOrganizationNames)];
                return renterOrganizationNames.join(',');
            },
        },
        {
            dataIndex: 'items',
            title: '资源',
            width: 144,
            render: (text: string, record: derateType, index: number) => {
                const items = record.items;
                const resource = items.length > 0 ? items[0].full_room_name : '';
                return <>{resource || '-'}</>;
            },
        },
        {
            dataIndex: 'created_on',
            title: '申请日期',
            width: 112,
            render: (text: string, record: derateType, index: number) => {
                const createdOn = record.created_on && record.created_on.replace(/(.*)\s.*/, '$1');
                return <>{createdOn || '-'}</>;
            },
        },
        {
            dataIndex: 'fee_item',
            title: '减免费项',
            width: 112,
            render: (text: string, record: derateType, index: number) => {
                let feeName: any = Array.from(new Set(record.items.map(bill => bill.fee_name)));
                feeName = feeName.join(',');
                return <>{feeName || '-'}</>;
            },
        },
        {
            dataIndex: 'derated_amount',
            title: '减免金额',
            width: 162,
            render: (text: string, record: derateType, index: number) => {
                const derated_amount = record.items.reduce((total: number, curr: any) => {
                    total += +curr.derated_amount || 0;
                    return total;
                }, 0);
                const demurrage_derated_amount = record.items.reduce((total: number, curr: any) => {
                    total += +curr.demurrage_derated_amount || 0;
                    return total;
                }, 0);
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
            render: (text: string, record: derateType, index: number) => {
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
            render(text: string, record: derateType, index: number) {
                const { user } = props;
                const stageId = record.proj_id;
                const oaName = getVal(record.proj_id, 'oaName');
                const isEnabled = getVal(record.proj_id, 'isEnabled');
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
                    </div>
                );
            },
        },
    ];

    return (
        <FedTable<derateType>
            vsides={false}
            rowKey="id"
            columns={columns}
            dataSource={derateList}
            rowSelection={{
                ...rowSelection,
            }}
            expandable={expandable}
            scroll={{
                y: 'calc( 100vh - 340px )',
            }}
        />
    );
};

export default DerateTable;
