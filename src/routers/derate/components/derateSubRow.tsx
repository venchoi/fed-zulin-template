import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Table, message, Input, Spin, Popover } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import FedButton from '@c/FedButton';
import FedSection from '@c/FedSection';
import Uploader from '@c/Uploader';
import { getDerateDetail, getDerateList } from '@s/derate';
import InputWithCount from './InputWithCount';
import { formatNum, comma } from '@/helper/commonUtils';
import { ColumnProps } from 'antd/es/table';
import { derateType, feeItem, responseType } from '../list.d';
import { fileType } from '@/types/common';
import { submitDerate } from '@s/derate';
import { cloneDeep } from 'lodash';
import './derateSubRow.less';
import { derateSubRowProps, status, feeItemType, derateDetail, saveDataType } from './derateSubRow.d';
const layout = {
    labelCol: {
        style: {
            width: '96px',
        },
    },
    wrapperCol: { span: 20 },
};

export const DerateSubRow = (props: derateSubRowProps) => {
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<feeItemType[]>([]);
    const [errorMsg, setErrorMsg] = useState('test'); // 错误弹窗popover内容
    const [isShowError, setIsShowError] = useState(false);
    const [detail, setDetail] = useState<derateDetail>({
        items: [],
        proj_name: '',
        remark: '',
        attachment: [],
        proj_id: '',
        id: '',
    }); // 减免详情
    const [originDetail, setOriginDetail] = useState({
        items: [],
        proj_name: '',
        remark: '',
        attachment: [],
        proj_id: '',
        id: '',
    }); // 减免详情拷贝值，编辑取消后还原
    const [isEditMode, setIsEditMode] = useState(false); // 是否编辑模式
    const [loading, setLoading] = useState(false);
    const fetchDerateDetail = () => {
        const id = props.record.id;
        if (!id) {
            return;
        }
        setLoading(true);
        getDerateDetail({ id })
            .then(res => {
                if (!res.result) {
                    return;
                }
                const { data = { items: [] } } = res;
                const roomsMap: { [index: string]: feeItemType[] } = {};
                data.copyItems = [];
                data.items.forEach((item: feeItemType) => {
                    const copyItem = {
                        isDemurrage: false,
                        ...item,
                    };
                    const copyDemurrageItem = {
                        isDemurrage: true,
                        ...item,
                    };
                    if (!roomsMap[item.room_name]) {
                        roomsMap[item.room_name] = [];
                    }
                    if ((copyItem.stayAmount || 0) * 1 > 0) {
                        roomsMap[item.room_name].push(copyItem);
                    }
                    if ((copyItem.stayDemurrageAmount || 0) * 1 > 0) {
                        roomsMap[item.room_name].push(copyDemurrageItem);
                    }
                    if (Array.isArray(copyItem.full_room_name)) {
                        copyItem.full_room_name = copyItem.full_room_name.join('、');
                    }
                    if (Array.isArray(copyDemurrageItem.full_room_name)) {
                        copyDemurrageItem.full_room_name = copyDemurrageItem.full_room_name.join('、');
                    }
                    copyItem.renter_name = copyItem.renter_organization_name;
                    copyDemurrageItem.renter_name = copyDemurrageItem.renter_organization_name;
                    if ((copyItem.stayAmount || 0) * 1 > 0) {
                        data.copyItems.push(copyItem);
                    }
                    if ((copyItem.stayDemurrageAmount || 0) * 1 > 0) {
                        data.copyItems.push(copyDemurrageItem);
                    }
                });
                data.items = data.copyItems;
                const selectedRowKeys = data.items.map((item: feeItemType) => {
                    return item.id + (item.isDemurrage ? '1' : '0');
                });
                setSelectedRowKeys(selectedRowKeys);
                const roomNames: string[] = Object.keys(roomsMap);
                roomNames.forEach(roomName => {
                    const len = roomsMap[roomName].length;
                    for (let j = 0; j < len; j++) {
                        if (j === 0) {
                            roomsMap[roomName][j].rowSpan = len;
                        } else {
                            roomsMap[roomName][j].rowSpan = 0;
                        }
                    }
                });
                setDetail(data);
                setOriginDetail(cloneDeep(data));
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchDerateDetail();
    }, [props.record.id]);

    const handleCancelEdit = () => {
        setDetail(originDetail);
        setIsEditMode(false);
    };

    const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const remark = e.target.value;
        setDetail({
            ...detail,
            remark: remark,
        });
    };

    const handleDerateAmountChange = (record: feeItemType) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            let value: any = e.target.value || '';
            value = value.replace(/[^0-9\.]/g, '');
            value = value.replace(/(\d*\.\d{1,2})(.*)/, '$1');
            if (value * 100 - (record.stayAmount || 0) * 100 > 0) {
                record.validateStatus = 'error';
                setErrorMsg('减免金额超出可减免金额，请修改正确后提交！');
                setIsShowError(true);
            } else if (!!value && value * 100 === 0) {
                record.validateStatus = 'error';
                setErrorMsg('减免金额不能为0！');
                setIsShowError(true);
            } else {
                record.validateStatus = '';
                setErrorMsg('');
                setIsShowError(false);
            }
            record.derated_amount = value;
            setDetail({
                ...detail,
            });
        };
    };

    const handleAttachmentChange = (file: fileType, files: fileType[]) => {
        setDetail({
            attachment: files,
            ...detail,
        });
    };

    const basicInfoForms = [
        {
            name: '租客',
            field: 'renter_organization_name',
            required: false,
            value: (detail: derateDetail) => {
                let renterOrganizationNames = detail.items.map(bill => bill.renter_organization_name);
                renterOrganizationNames = [...new Set(renterOrganizationNames)];
                return renterOrganizationNames.join(',');
            },
        },
        {
            name: '合同编号',
            field: 'contract_code',
            required: false,
            value: (detail: derateDetail) => {
                return (detail.items && detail.items[0] && detail.items[0].contract_code) || '';
            },
        },
        {
            name: '项目名称',
            field: 'proj_name',
            required: false,
            value: (detail: derateDetail) => {
                return detail['proj_name'];
            },
        },
    ];

    const validateForm = () => {
        const { items = [] } = detail;
        const hasError = items.some(item => {
            const isSelected = selectedRowKeys.find(id => {
                const itemId = item.id + (item.isDemurrage ? '1' : '0');
                return itemId === id;
            });
            return item.validateStatus === 'error' && isSelected;
        });
        return !hasError;
    };

    const handleSave = async () => {
        const { attachment, remark, proj_id, id, items = [] } = detail;
        const params: saveDataType = {
            attachment: attachment || [],
            derated_items: [],
            remark: remark,
            proj_id,
            id,
        };
        params.attachment.forEach((attach: fileType) => delete attach.edit);
        if (selectedRowKeys.length === 0) {
            message.error('没有选择的减免明细');
            return;
        }
        if (!validateForm()) {
            return;
        }
        const billsMap: { [index: string]: feeItemType[] } = {};
        items.forEach((item: feeItemType) => {
            if (!billsMap[item.bill_item_id]) {
                billsMap[item.bill_item_id] = [];
            }
            billsMap[item.bill_item_id].push(item);
        });
        params.derated_items = Object.keys(billsMap).map(billItemId => {
            let deratedAmount, demurrageDeratedAmount;
            billsMap[billItemId].forEach(innerItem => {
                if (innerItem.isDemurrage) {
                    demurrageDeratedAmount = innerItem.stayDemurrageAmount;
                } else {
                    deratedAmount = innerItem.derated_amount;
                }
            });
            return {
                bill_item_id: billItemId,
                derated_amount: deratedAmount,
                demurrage_derated_amount: demurrageDeratedAmount,
            };
        });
        setLoading(true);
        const { data, msg, result } = await submitDerate(params);
        if (result) {
            message.success('保存成功！');
            setIsEditMode(false);
            fetchDerateDetail();
        }
        setLoading(false);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: any, selectedRows: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
    };

    const columns: ColumnProps<feeItemType>[] = [
        {
            dataIndex: 'room_name',
            title: '资源',
            width: 192,
            render: (text: string, record: feeItemType, index: number) => {
                const tempObj = {
                    children: record.full_room_name,
                    props: {
                        rowSpan: record.rowSpan,
                    },
                };
                return tempObj;
            },
        },
        {
            dataIndex: 'fee_name',
            title: '费项',
            width: 137,
            render: (text: string, record: feeItemType, index: number) => {
                return record.isDemurrage ? '滞纳金' : text;
            },
        },
        {
            dataIndex: 'start_date',
            title: '账期',
            width: 224,
            render: (text: string, record: feeItemType, index: number) => {
                return `${record.start_date} 至 ${record.end_date}`;
            },
        },
        {
            dataIndex: 'amount',
            title: '应收金额',
            width: 120,
            align: 'right',
            render: (text: string, record: feeItemType, index: number) => {
                return record.isDemurrage
                    ? comma(formatNum(+record.stayDemurrageAmount || '0.00'))
                    : comma(formatNum(+record.amount || '0.00'));
            },
        },
        {
            dataIndex: 'amount',
            title: '可减免金额',
            width: 120,
            align: 'right',
            render: (text: string, record: feeItemType, index: number) => {
                return record.isDemurrage
                    ? comma(formatNum(+record.stayDemurrageAmount || '0.00'))
                    : comma(formatNum(+record.stayAmount || '0.00'));
            },
        },
        {
            dataIndex: 'derate',
            title: '减免金额',
            width: 120,
            align: 'right',
            render: (text: string, record: feeItemType, index: number) => {
                const deratedAmount = record.isDemurrage
                    ? comma(formatNum(record.stayDemurrageAmount || '0.00'))
                    : comma(formatNum(record.derated_amount || '0.00'));
                const isSelectedFee = selectedRowKeys.find(key => key === record.id + '0');
                const isSelectedDelay = selectedRowKeys.find(key => key === record.id + '1');
                const deratedFormItem = record.isDemurrage ? (
                    <Form.Item validateStatus={record.validateStatus}>
                        <Input disabled value={isSelectedDelay ? record.stayDemurrageAmount : ''} />
                    </Form.Item>
                ) : (
                    <Form.Item validateStatus={record.validateStatus}>
                        <Input
                            disabled={!isSelectedFee}
                            onChange={handleDerateAmountChange(record)}
                            value={!isSelectedFee ? '' : record.derated_amount}
                        />
                    </Form.Item>
                );
                return !isEditMode ? deratedAmount : deratedFormItem;
            },
        },
    ];
    const selectedRowKeysMap: { [index: string]: boolean } = {};
    selectedRowKeys.forEach((item: string) => {
        selectedRowKeysMap[item] = true;
    });
    // 合计减免
    const totalDeratedAmount = detail.items.reduce((total: number, item) => {
        const key = item.id + (item.isDemurrage ? '1' : '0');
        if (selectedRowKeysMap[key]) {
            total = total + (!item.isDemurrage ? (+item.derated_amount || 0) * 1 : (item.stayDemurrageAmount || 0) * 1);
        }
        return total;
    }, 0);

    const popoverError = (
        <div className="content-container">
            <CloseCircleFilled className="red" />
            <span className="text">{errorMsg}</span>
        </div>
    );

    return (
        <Spin spinning={loading}>
            <div className="derate-detail">
                <div className="head-area">
                    <span className="title">减免详情</span>
                    <div className="op-btns link-btn  f-hidden rental-derate-edit">
                        {isEditMode ? (
                            <>
                                {isShowError ? (
                                    <Popover
                                        content={popoverError}
                                        title=""
                                        trigger="hover"
                                        placement="bottomRight"
                                        overlayClassName="derate-err-content"
                                    >
                                        <FedButton type="primary" size="small" onClick={handleSave}>
                                            保存
                                        </FedButton>
                                    </Popover>
                                ) : (
                                    <FedButton type="primary" size="small" onClick={handleSave}>
                                        保存
                                    </FedButton>
                                )}
                                <FedButton size="small" onClick={handleCancelEdit}>
                                    取消
                                </FedButton>
                            </>
                        ) : props.record.status === '待审核' ? (
                            <FedButton size="small" onClick={() => setIsEditMode(true)}>
                                编辑
                            </FedButton>
                        ) : null}
                    </div>
                </div>
                <div className="content-area">
                    <FedSection title="基本信息" key="基本信息">
                        <Form {...layout} form={form} className="ant-advanced-search-form">
                            <Row gutter={24}>
                                {basicInfoForms.map((formItem, i) => {
                                    return (
                                        <Col span={8} key={i} className="derate-detail-form-item">
                                            <Form.Item
                                                name={formItem.field}
                                                label={formItem.name}
                                                rules={[
                                                    {
                                                        required: formItem.required,
                                                    },
                                                ]}
                                            >
                                                {formItem.value ? formItem.value(detail) : '-'}
                                            </Form.Item>
                                        </Col>
                                    );
                                })}
                                <Col span={24} key={5}>
                                    <Form.Item
                                        name="remark"
                                        label="减免原因"
                                        rules={[
                                            {
                                                required: false,
                                            },
                                        ]}
                                    >
                                        {isEditMode ? (
                                            <InputWithCount
                                                defaultValue={detail.remark}
                                                placeholder="请输入"
                                                maxLength={255}
                                                onChange={handleRemarkChange}
                                            />
                                        ) : (
                                            detail.remark || '-'
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </FedSection>
                    <FedSection title="减免明细" key="减免明细">
                        <>
                            <Table
                                rowSelection={isEditMode ? rowSelection : undefined}
                                pagination={false}
                                columns={columns}
                                dataSource={detail.items}
                                rowKey={(record: feeItemType) => {
                                    return record.id + (record.isDemurrage ? '1' : '0');
                                }}
                            />
                            <div className="total-bar">
                                <span>本次合计减免：</span>
                                <span>{comma(formatNum(totalDeratedAmount))}</span>
                            </div>
                        </>
                    </FedSection>
                    <FedSection title="减免附件" key="减免附件">
                        {(detail.attachment && detail.attachment.length > 0) || isEditMode ? (
                            <Uploader
                                files={detail.attachment || []}
                                onChange={handleAttachmentChange}
                                readonly={!isEditMode}
                                maxSize={50}
                            />
                        ) : (
                            <span>-</span>
                        )}
                    </FedSection>
                </div>
            </div>
        </Spin>
    );
};

export default DerateSubRow;
