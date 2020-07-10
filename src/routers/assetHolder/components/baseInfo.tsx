import React, { useState } from 'react';
import { IAddAssetHolder, IAddAssetHolderBank, IAssetHolderBankList } from '@t/assetHolder';
import FedTable from '@/components/FedTable';
import FedDataSection from '@c/FedDataSection/FedDataSection';
import FedDataRow from '@c/FedDataSection/FedDataRow';
import { valueOf } from '@/types/global';
import AddBankForm from './addBankForm';
import './baseInfo.less';

interface IDataSection {
    label: '';
    value: valueOf<IAddAssetHolder>;
}

const BaseInfo = ({ detail, account }: { detail: IAddAssetHolder; account: IAssetHolderBankList }) => {
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
                value: detail.project_id,
            },
            {
                label: '证件类型',
                value: detail.id_code_type,
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
                value: detail.manager,
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
    const renderFedDataSection = (data: IDataSection[][]) => (
        <div className="baseinfo-content">
            {data.map((itemList, index) => (
                <div key={`baseinfo-item-${index}`} className="baseinfo-item">
                    {itemList.map(item => (
                        <FedDataRow key={item.label} rowData={item} />
                    ))}
                </div>
            ))}
        </div>
    );
    const handleAddAccount = () => {
        setShowAddAccount(true);
    };
    const onCancel = () => {
        setShowAddAccount(false);
    };
    const onSave = (values: IAddAssetHolderBank) => {
        setShowAddAccount(false);
        //setBankList([...bankList, values]);
    };
    const columns = [
        {
            title: '开户行',
            dataIndex: 'number',
        },
        {
            title: '账号',
            dataIndex: 'account',
        },
        {
            title: '户名',
            dataIndex: 'name',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
    ];
    const [dataSource, setDataSource] = useState([]);
    const renderFedDataTableSection = (data: IDataSection[][]) => (
        <div className="baseinfo-content" style={{ position: 'relative' }}>
            <div onClick={handleAddAccount} className="add-bank-account-btn">
                +添加账号
            </div>
            <FedTable columns={columns} dataSource={dataSource} rowKey="id" scroll={{ y: 'calc(100vh - 820px)' }} />
        </div>
    );
    const baseInfoContent = renderFedDataSection(baseInfoData as IDataSection[][]);
    const accountInfoContent = renderFedDataTableSection(baseInfoData as IDataSection[][]);
    const systematicallyContent = renderFedDataSection(systematicallyData as IDataSection[][]);
    const sectionList = [
        {
            title: '基本信息',
            content: baseInfoContent,
        },
        {
            title: '账户信息',
            content: accountInfoContent,
        },
        {
            title: '系统信息',
            content: systematicallyContent,
        },
    ];
    return (
        <div className="asset-holder-base-info-wrap">
            {sectionList.map(section => (
                <FedDataSection key={section.title} section={section} />
            ))}
            {showAddAccount ? (
                <AddBankForm onCancel={onCancel} onOk={onSave} isSubmit bankId="39f645e4-ed92-67fa-052b-00c9c755853a" />
            ) : null}
        </div>
    );
};
export default BaseInfo;
