import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Select, Modal, Spin, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { auditDetailType, auditListType } from '../list.d';
import { SelectValue } from 'antd/lib/select';
import Uploader from '@c/Uploader';
import { fetchAuditDetail, auditRenter } from '@s/renterCustomerService';
import { formatPhone } from '../../../helper/commonUtils';
import { fileType } from '@t/common';
interface auditDetailModalType {
    isShowModal?: Boolean;
    record?: auditListType;
    onClose(isSuccess?: boolean): void;
    setLoading(val: boolean): void;
    isAudit?: boolean;
}

const layout = {
    labelCol: {
        style: {
            width: 100,
        },
    },
    wrapperCol: { span: 16 },
};

const initialDetail = {
    contract_code: '',
    project_name: '',
    contract_room: [],
    created_on: '',
    apply_user_name: '',
    master_phone: '',
    origin_master_name: '',
    origin_master_phone: '',
    attachment: [],
};
export const auditDetailModal = function(props: auditDetailModalType): JSX.Element {
    const { isShowModal, record, isAudit, onClose } = props;
    const [loading, setLoading] = useState(false);
    const [auditDetail, setAuditDetail] = useState<auditDetailType>({ ...initialDetail });
    const {
        contract_code,
        project_name,
        contract_room,
        created_on,
        apply_user_name,
        master_phone,
        origin_master_name,
        origin_master_phone,
        attachment,
    } = auditDetail;

    useEffect(() => {
        if (isShowModal) {
            getAuditDetail();
        }
    }, [isShowModal]);

    // 获取审批详情
    const getAuditDetail = async () => {
        let params = {
            apply_id: record?.apply_id || '',
        };
        if (!params.apply_id) {
            return;
        }
        setLoading(true);
        const { result, data } = await fetchAuditDetail(params);
        if (result && data) {
            setAuditDetail(data);
        }
        setLoading(false);
    };

    const closeModal = () => {
        setAuditDetail({ ...initialDetail });
        onClose && onClose();
    };

    const handleAudit = async (isPassed: boolean) => {
        const params = {
            apply_id: record?.apply_id || '',
            status: isPassed ? '审核通过' : '审核不通过',
        };
        const { result } = await auditRenter(params);
        if (result) {
            onClose && onClose(true);
            message.success('审核成功');
        }
    };

    const handleOk = () => {
        if (!isAudit) {
            closeModal();
        } else {
            handleAudit(true);
        }
    };

    const handleCancel = () => {
        if (!isAudit) {
            closeModal();
        } else {
            handleAudit(true);
        }
    };

    const okText = isAudit ? '审核通过' : '确定';
    const cancelText = isAudit ? '审核不通过' : '取消';
    return (
        <Modal
            centered
            width={480}
            title="审批详情"
            visible={!!isShowModal}
            onCancel={closeModal}
            wrapClassName="audit-renter-detail-form-modal"
            footer={[
                <Button key="back" onClick={handleCancel}>
                    {cancelText}
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    {okText}
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form {...layout} name="audit-renter-detail-form">
                    <Form.Item label="相关合同">{contract_code}</Form.Item>
                    <Form.Item label="相关项目">{project_name}</Form.Item>
                    <Form.Item label="相关房间">
                        {contract_room
                            ? contract_room.map((item, index) => (
                                  <p
                                      className={`room-item ${
                                          contract_room.length > 1 && index == 0 ? 'first-room' : ''
                                      }`}
                                  >
                                      {item.room_name}
                                  </p>
                              ))
                            : '--'}
                    </Form.Item>
                    <Form.Item label="申请时间">{created_on}</Form.Item>
                    <Form.Item label="申请人姓名">{apply_user_name}</Form.Item>
                    <Form.Item label="申请人手机">{master_phone || '--'}</Form.Item>
                    <Form.Item label="原管理人姓名">{origin_master_name || '--'}</Form.Item>
                    <Form.Item label="原管理人手机">{origin_master_phone || '--'}</Form.Item>
                    <Form.Item label="附件">
                        {attachment && attachment.length > 0 ? (
                            <Uploader readonly files={attachment || []} maxSize={50} />
                        ) : (
                            <span>-</span>
                        )}
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default auditDetailModal;
