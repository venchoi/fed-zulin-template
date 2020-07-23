import React, { useState } from 'react';
import { IAddAssetHolder, IAddAssetHolderBank, IAssetHolderBankList } from '@t/assetHolder';
import FedDataSection from '@c/FedDataSection/FedDataSection';
import { valueOf } from '@/types/global';
import AddBaseForm from './addBaseForm';
import AddBankForm from './addBankForm';
import BankTable from './bankTable';
import './baseInfo.less';
import { Modal, Row, Col } from 'antd';
import FedIcon from '@c/FedIcon';

interface IDataSection {
    label: '';
    value: valueOf<IAddAssetHolder>;
}

interface IDetail {
    detail: IAddAssetHolder;
    account: IAssetHolderBankList;
    onUpdate?: () => void;
}

const BaseInfo = ({ detail, account, onUpdate }: IDetail) => {
    const baseInfoData = [
        [
            {
                label: '持有人名称',
                value: detail.name,
            },
            {
                label: '持有人简称',
                value: detail.short_name,
            },
            {
                label: '英文名称',
                value: detail.english_name,
            },
            {
                label: '英文简称',
                value: detail.english_short_name,
            },
            {
                label: '客户类型',
                value: detail.type,
            },
            {
                label: '关联项目',
                value: (detail.projects || []).join('、'),
            },
            {
                label: '证件类型',
                value: detail.id_code_type_name,
            },
            {
                label: '证件号码',
                value: detail.id_code,
            },
            {
                label: '联系人',
                value: detail.contacter,
            },
            {
                label: '联系电话',
                value: detail.mobile,
            },
            {
                label: '信息地址',
                value: detail.address,
            },
            {
                label: '负责人',
                value: detail.manager_name,
            },
        ],
    ];
    const systematicallyData = [
        [
            {
                label: '创建时间',
                value: detail.created_on,
            },
            {
                label: '创建人',
                value: detail.created_by_name,
            },
        ],
    ];
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [editBaseInfo, setEditBaseInfo] = useState(false);
    const handleAddAccount = () => {
        setShowAddAccount(true);
    };
    const onUpdateTale = () => {
        if (onUpdate) {
            onUpdate();
        }
    };
    const onCancel = () => {
        setShowAddAccount(false);
    };
    const onSave = (values: IAddAssetHolderBank) => {
        setShowAddAccount(false);
        onUpdateTale();
    };
    // 编辑基本信息
    const onEditBaseInfo = () => {
        console.log('detail', detail);
        setEditBaseInfo(true);
    };
    const renderFedDataSection = (data: IDataSection[][]) => (
        <div className="baseinfo-content">
            {data.map((itemList, index) => (
                <div key={`baseinfo-item-${index}`} className="baseinfo-item">
                    <Row>
                        {itemList.map(item => (
                            <Col span={6} className="detail-item-wrap">
                                <span>{item.label}:</span>
                                {item.value}
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    );
    const renderFedDataTableSection = (data: IDataSection[][]) => (
        <BankTable data={account} isCanOperate onDelete={onUpdateTale} onUpdate={onUpdateTale} />
    );
    const baseInfoContent = renderFedDataSection(baseInfoData as IDataSection[][]);
    const accountInfoContent = renderFedDataTableSection(baseInfoData as IDataSection[][]);
    const systematicallyContent = renderFedDataSection(systematicallyData as IDataSection[][]);
    const sectionList = [
        {
            title: '基本信息',
            showEditIcon: <FedIcon type="icon-bianji" className="edit-icon" title="编辑" onClick={onEditBaseInfo} />,
            content: baseInfoContent,
        },
        {
            title: '账户信息',
            extra: (
                <div onClick={handleAddAccount} className="add-bank-account-btn">
                    +添加账号
                </div>
            ),
            content: accountInfoContent,
        },
        {
            title: '系统信息',
            content: systematicallyContent,
        },
    ];
    return (
        <>
            <div className="asset-holder-base-info-wrap">
                {sectionList.map(section => (
                    <FedDataSection key={section.title} section={section} />
                ))}
                {showAddAccount ? (
                    <AddBankForm onCancel={onCancel} onOk={onSave} assetHolderId={detail.id} isSubmit />
                ) : null}
            </div>
            {editBaseInfo ? (
                <Modal
                    title="修改基本信息"
                    visible={editBaseInfo}
                    onOk={() => {
                        setEditBaseInfo(false);
                    }}
                    onCancel={() => {
                        setEditBaseInfo(false);
                    }}
                    wrapClassName="edit-base-modal-wrap"
                >
                    <AddBaseForm id={detail.id} onOk={() => {}} />
                </Modal>
            ) : null}
        </>
    );
};
export default BaseInfo;
