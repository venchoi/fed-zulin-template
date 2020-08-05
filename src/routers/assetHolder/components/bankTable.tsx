import React, { useState, useEffect } from 'react';
import { message, Table, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { postAddAssetHolderBank, postDeleteAssetHolderBank } from '@/services/assetHolder';
import { IAddAssetHolderBank } from '@t/assetHolder';
import FedIcon from '@c/FedIcon';
import AddBankForm from './addBankForm';
import './bankTable.less';

interface IProps {
    onFinishUpdate?: () => void; // 数据更新完回调
    data: IAddAssetHolderBank[]; // 数据
    isCanOperate: boolean; // 是否显示操作
    isNoShowPage?: boolean; // 是否显示翻页
    onDelete?: (id: string) => void;
    onUpdate?: (value: IAddAssetHolderBank) => void;
}
const BankTable = ({ data, isCanOperate = false, isNoShowPage = false, onDelete, onUpdate }: IProps) => {
    useEffect(() => {}, []);
    const [showEditBankAccount, setShowEditBankAccount] = useState(false);
    const [editBankAccountData, setEitBankAccountData] = useState({});
    const columns = [
        {
            title: '开户行',
            dataIndex: 'bank',
            key: 'bank',
        },
        {
            title: '银行账号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '户名',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            dataIndex: 'id',
            title: '操作',
            width: 100,
            render: (text: string, rowData: IAddAssetHolderBank) => {
                return (
                    <>
                        <EditOutlined
                            title="编辑"
                            className="account-record-icon"
                            onClick={editAccount.bind(null, rowData)}
                        />
                        <Popconfirm
                            placement="topRight"
                            title="确定删除该账户信息吗?"
                            onConfirm={() => {
                                deleteAccount(rowData.id || '');
                            }}
                            okText="确定"
                            cancelText="取消"
                        >
                            <DeleteOutlined title="删除" style={{ marginLeft: 16 }} className="account-record-icon" />
                        </Popconfirm>
                    </>
                );
            },
        },
    ];
    if (!isCanOperate) {
        columns.pop();
    }
    // 删除
    const deleteAccount = (id: string) => {
        // 增加 数据模式下的删除
        if (id.indexOf('0.') > -1) {
            if (onDelete) {
                onDelete(id);
            }
        } else {
            if (id) {
                // 调用接口直接删除数据
                postDeleteAssetHolderBank({ id }).then(json => {
                    const { result, msg } = json;
                    if (result) {
                        message.success('删除成功');
                        if (onDelete) {
                            onDelete(id);
                        }
                    } else {
                        message.error(msg || '操作失败');
                    }
                });
            } else {
                message.error('Id不存在!');
            }
        }
    };
    // 编辑
    const editAccount = (rowData: IAddAssetHolderBank) => {
        setShowEditBankAccount(true);
        setEitBankAccountData(rowData);
    };
    // 编辑 弹框取消
    const onCancel = () => {
        setShowEditBankAccount(false);
    };
    // 编辑 弹框确定
    const onSave = (values: IAddAssetHolderBank) => {
        setShowEditBankAccount(false);
        if ((values.id || '').indexOf('0.') > -1) {
            if (onUpdate) {
                onUpdate(values);
            }
        } else {
            // 调用接口直接更新数据
            console.log(data, values);
            postAddAssetHolderBank(Object.assign({}, data, values)).then(json => {
                const { result, msg } = json;
                if (result) {
                    message.success('修改成功');
                    if (onUpdate) {
                        onUpdate(values);
                    }
                } else {
                    message.error(msg || '操作失败');
                }
            });
        }
    };
    return (
        <>
            <div className="add-base-account-table-wrap">
                <Table dataSource={data} columns={columns} size="small" bordered pagination={isNoShowPage} />
            </div>
            {showEditBankAccount ? <AddBankForm onCancel={onCancel} onOk={onSave} data={editBankAccountData} /> : null}
        </>
    );
};

export default BankTable;
