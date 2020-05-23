import React, { useState, useEffect, ReactText } from 'react';
import { Card, Button, Table, message, Modal, Popover, DatePicker } from 'antd';
import RoomCascader from '@c/RoomCascader';
import { PaginationConfig } from 'antd/es/pagination';
import DerateSubRow from './derateSubRow';
import moment from 'moment';
import { ColumnProps } from 'antd/es/table';
import {
    RightOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    FilterFilled,
    CalendarFilled,
} from '@ant-design/icons';
import { History } from 'history';
import FedTable from '@c/FedTable';
import {
    fetchMuiltStageWorkflowTempIsEnabled,
    auditDerate,
    batchAuditDerate,
    voidDerate,
    cancelDerate,
    fetchOaDetailData,
} from '@s/derate';
import { formatNum, comma, checkPermission } from '@/helper/commonUtils';
import {
    User,
    projsValue,
    feeItem,
    derateType,
    statusMapType,
    responseType,
    enableItemType,
    billFeeItemType,
} from '../list.d';
import { getDerateListParams } from '@/types/derateTypes';
import { derateTableProps, selectedRowKeyType, selectedRoomConfigType, selectedConfigType } from './derateTable.d';
import { handleOaAudit } from './derateTableFn';
const { confirm } = Modal;
const baseAlias = 'static';
export const DerateTable = (props: derateTableProps) => {
    const { setLoading, getDerateListData } = props;
    const { derateList, derateTotal, user, history, onTableSelect, selectedRowKeys } = props;
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [enableList, setenableList] = useState<enableItemType[]>([]); // 减免列表
    const [expandedRows, setExpandedRows] = useState<ReactText[]>([]);
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const [selectedRoomConfig, setSelectedRoomConfig] = useState({
        selectedProjId: '',
        subdistrictId: '',
        buildingId: '',
        floorId: '',
        floorName: '',
        roomId: '',
    });
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
    const getWorkflowStatus = async (projIdStr: string) => {
        const res = await fetchMuiltStageWorkflowTempIsEnabled({
            proj_id: projIdStr,
            scenario_code: 'derated_apply',
        });
        if (res.result) {
            const data = res;
            setIsEnabledList(data, 'derated_apply');
        }
    };

    const getVal = (projId: string, key: string) => {
        const match: any = enableList.find(item => item.projId === projId);
        if (match) {
            return match[key];
        }
        return false;
    };

    const fetchOaDetail = async (record: derateType, e: React.MouseEvent) => {
        e && e.stopPropagation();
        const params = {
            business_id: record.id,
            scenario_code: 'derated_apply',
            url_field: 'pc_detail_url',
        };
        setLoading(true);
        const { result, data } = await fetchOaDetailData(params);
        setLoading(false);
        if (result) {
            if (data && data.url) {
                window.open(data.url, '_blank');
            } else {
                message.error('获取地址失败');
            }
        }
    };

    const handleAudit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定审核该记录？',
            onOk: async () => {
                setLoading(true);
                const { result, msg = '操作失败', data } = await auditDerate({ id });
                setLoading(false);
                if (result) {
                    getDerateListData();
                    message.success('操作成功');
                } else {
                    message.error(msg);
                }
            },
        });
    };

    const handleVoid = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定作废该记录？',
            onOk: async () => {
                setLoading(true);
                const { result, msg = '操作失败', data } = await voidDerate({ id });
                setLoading(false);
                if (result) {
                    getDerateListData();
                    message.success('操作成功');
                } else {
                    message.error(msg);
                }
            },
        });
    };

    const handleCancelDerate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定取消减免该记录？',
            onOk: async () => {
                setLoading(true);
                const { result, msg = '操作失败', data } = await cancelDerate({ ids: id });
                setLoading(false);
                if (result) {
                    getDerateListData();
                    message.success('操作成功');
                } else {
                    message.error(msg);
                }
            },
        });
    };

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
        expandIconColumnIndex: 0,
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
        onExpandedRowsChange: (expandedRows: ReactText[]) => {
            setExpandedRows(expandedRows);
        },
    };

    useEffect(() => {
        const projStr = props.projIds ? props.projIds.join(',') : '';
        // getWorkflowStatus(projStr);
    }, [props.projIds.join(',')]);
    const handleTableChange = (pagination: PaginationConfig, filters: any, sorter: any) => {
        console.log(pagination, filters, sorter);
        const fee_name = filters.fee_item && filters.fee_item.length > 0 ? filters.fee_item.join(',') : '';
        props.setSearchParams({
            ...props.searchParams,
            fee_name,
        });
    };
    const isFiltered = !!props.searchParams.start_date || !!props.searchParams.end_date;
    // 资源是否过滤
    const isRSFiltered =
        !!props.searchParams.room_id ||
        !!props.searchParams.building_id ||
        !!!!props.searchParams.floor_name ||
        !!props.searchParams.subdistrict_id;
    const columns: ColumnProps<derateType>[] = [
        {
            dataIndex: 'code',
            title: '减免流水号',
            width: 200,
            render: (text: string, record: derateType, index: number) => {
                return (
                    <span className="derate-table-td" title={text || '-'}>
                        {text}
                    </span>
                );
            },
        },
        {
            dataIndex: 'proj_name',
            title: '项目名称',
            width: 120,
            render: (text: string, record: derateType, index: number) => {
                return (
                    <span className="derate-table-td" title={text || '-'}>
                        {text || '-'}
                    </span>
                );
            },
        },
        {
            dataIndex: 'renter_organization_names',
            title: '租客',
            width: 136,
            render: (text: string, record: derateType, index: number) => {
                let renterOrganizationNames = record.items.map(bill => bill.renter_organization_name);
                renterOrganizationNames = [...new Set(renterOrganizationNames)];
                const names = renterOrganizationNames.join(',');
                return (
                    <span className="derate-table-td" title={names || '-'}>
                        {names}
                    </span>
                );
            },
        },
        {
            dataIndex: 'items',
            title: '资源',
            width: 144,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                const projIds = props.projIds ? props.projIds.join(',') : '';
                const projNames = props.projNames ? props.projNames.join(',') : '';
                return (
                    <RoomCascader
                        style={{ minWidth: 150 }}
                        projIds={projIds}
                        projNames={projNames}
                        selectedConfig={selectedRoomConfig}
                        onChange={(selectedConfig: selectedConfigType) => {
                            const { stageId, subdistrictId, buildingId, floorId, floorName, roomId } = selectedConfig;
                            confirm();
                            setSelectedRoomConfig({
                                selectedProjId: stageId,
                                subdistrictId,
                                buildingId,
                                floorId,
                                floorName,
                                roomId,
                            });
                            props.setSearchParams({
                                ...props.searchParams,
                                room_id: roomId,
                                subdistrict_id: subdistrictId,
                                building_id: buildingId,
                                floor_id: floorId,
                                floor_name: floorName,
                            });
                        }}
                    />
                );
            },
            filtered: isRSFiltered,
            filterIcon: () => {
                return <FilterFilled style={{ color: isRSFiltered ? '#1890ff' : undefined }} />;
            },
            render: (text: string, record: derateType, index: number) => {
                const items = record.items;
                const roomNames = [...new Set(items.map(item => item.full_room_name))];
                const pacakgeNames =
                    record.package_rooms && record.package_rooms.length > 0 ? record.package_rooms : false;
                if (pacakgeNames) {
                    return pacakgeNames.map(packageRoom => {
                        const rooms = packageRoom.room_names ? packageRoom.room_names.split(',') : [];
                        const popoverContent = (
                            <div>
                                {rooms.map(room => {
                                    return <p>{room}</p>;
                                })}
                            </div>
                        );
                        return (
                            <div className="rs-td-container">
                                <span className="derate-table-td-rs" title={packageRoom.package_name || '-'}>
                                    {packageRoom.package_name}
                                </span>
                                <Popover title="打包资源列表" placement="bottom" content={popoverContent}>
                                    <InfoCircleOutlined
                                        style={{
                                            color: '#BEC3C7',
                                            marginLeft: '5px',
                                            marginTop: '4px',
                                        }}
                                    />
                                </Popover>
                            </div>
                        );
                    });
                }
                return roomNames.map(room => {
                    return (
                        <span className="derate-table-td" title={room || '-'}>
                            {room || '-'}
                        </span>
                    );
                });
            },
        },
        {
            dataIndex: 'created_on',
            title: '申请日期',
            width: 120,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                const value: any = [
                    props.searchParams.start_date ? moment(props.searchParams.start_date) : '',
                    props.searchParams.end_date ? moment(props.searchParams.end_date) : '',
                ];
                return (
                    <DatePicker.RangePicker
                        onChange={(values: any, formatString: [string, string]) => {
                            confirm();
                            props.setSearchParams({
                                ...props.searchParams,
                                start_date: values && values[0] ? values[0].format('YYYY-MM-DD') : '',
                                end_date: values && values[1] ? values[1].format('YYYY-MM-DD') : '',
                            });
                        }}
                        value={value}
                    ></DatePicker.RangePicker>
                );
            },
            filtered: isFiltered,
            filterIcon: () => {
                return <CalendarFilled style={{ color: isFiltered ? '#1890ff' : undefined }} />;
            },
            render: (text: string, record: derateType, index: number) => {
                const createdOn = record.created_on && record.created_on.replace(/(.*)\s.*/, '$1');
                return (
                    <span className="derate-table-td" title={createdOn || '-'}>
                        {createdOn || '-'}
                    </span>
                );
            },
        },
        {
            dataIndex: 'fee_item',
            title: '减免费项',
            width: 112,
            filters: props.feeItemList,
            render: (text: string, record: derateType, index: number) => {
                let feeName: any = Array.from(new Set(record.items.map(bill => bill.fee_name)));
                feeName = feeName.join(',');
                return (
                    <span className="derate-table-td" title={feeName || '-'}>
                        {feeName || '-'}
                    </span>
                );
            },
        },
        {
            dataIndex: 'derated_amount',
            title: '减免金额',
            width: 112,
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
                return (
                    <span className="derate-table-td" title={totalDerate || '-'}>
                        {totalDerate || '-'}
                    </span>
                );
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
            fixed: expandedRows.length > 0 ? undefined : 'right',
            width: 128,
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
                            >
                                提交审批
                            </Button>
                        ) : null}
                        {record.workflow_instance_id && record.status !== '待审核' ? (
                            <a
                                className="link-btn f-hidden rental-derate-view"
                                href={`/${baseAlias}/workflowApproval/detail/${record.workflow_instance_id}`}
                            >
                                审批详情
                            </a>
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
                            >
                                审核
                            </Button>
                        ) : null}
                        {record.status === '待审核' ? (
                            <Button
                                type="link"
                                className="link-btn f-hidden rental-derate-void"
                                onClick={handleVoid.bind(this, record.id)}
                            >
                                作废
                            </Button>
                        ) : null}
                        {record.status === '已减免' ? (
                            <Button
                                type="link"
                                className="link-btn f-hidden rental-derate-unaudit"
                                onClick={handleCancelDerate.bind(this, record.id)}
                            >
                                取消减免
                            </Button>
                        ) : null}
                        {record.status !== '待审核' && record.wh_approval_info && record.wh_approval_info.detail_url ? (
                            <a
                                className="operate-btn"
                                target="_blank"
                                href={record.wh_approval_info && record.wh_approval_info.detail_url}
                                style={{ marginLeft: '16px' }}
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
            className="derate-table"
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
            onChange={handleTableChange}
        />
    );
};
export default DerateTable;
