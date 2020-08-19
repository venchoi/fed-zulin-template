/**
 * 选择退租合同弹框
 * 包括 筛选条件 与 合同信息
 */
import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getContractList } from '../../../services/index';
import './selectContractModal.less';

interface IProps {
    onCancel: () => void;
    onOk?: () => void;
}

interface projectsValue {
    projIds: Array<string>;
    projNames: Array<string>;
}

const rowSelection = {
    type: 'radio',
    onChange: (selectedRowKeys: string, selectedRows: any) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    // getCheckboxProps: (record: any) => ({
    //     disabled: record.code === 'TZ20200726015428838', // Column configuration not to be checked
    //     name: record.name,
    // }),
};

const SelectContractModal = ({ onCancel }: IProps) => {
    const columns = [
        {
            title: '合同编号',
            dataIndex: 'code',
            key: 'code',
            render: (item: string) => {
                return (
                    <a href={'/asset-holder/list'} target={'_blank'}>
                        {item}
                    </a>
                );
            },
            width: 209,
            fixed: 'left',
        },
        {
            title: '资源名称',
            dataIndex: 'rooms',
            key: 'rooms',
            width: 330,
            render: (item: any) => {
                if (item && item.length > 1) {
                    return (
                        <div>
                            <span className="room-resources">
                                {item.map((r: any) => r.room_name || '-').join('、')}
                            </span>
                            <InfoCircleOutlined />
                        </div>
                    );
                } else if (item && item.length === 1) {
                    return (item[0] || {}).room_name || '-';
                }
                return '-';
            },
        },
        {
            title: '承租方',
            dataIndex: 'organization_name',
            key: 'organization_name',
            width: 245,
        },
        {
            title: '合同期限',
            dataIndex: 'project1',
            key: 'project1',
            render: (text: string | undefined, item: any) => {
                return item ? (
                    <span>
                        {item.sign_date}至{item.end_date}
                    </span>
                ) : (
                    '-'
                );
            },
        },
    ];
    const [data, setData] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    // 获取数据
    const getContract = async () => {
        const { data } = await getContractList({ keywords: '', project_ids: '', page: 1, page_size: 20 });
        if (data) {
            const items = data.items;
            setData(items);
        }
        setLoading(false);
    };

    // 切换项目回调
    const handleTreeSelected = (selectedProject: projectsValue) => {
        console.log('projsValue', selectedProject);
        getContract().then();
    };

    return (
        <>
            <Modal
                title="选择退租合同"
                visible={true}
                onOk={() => {
                    onCancel();
                }}
                width={960}
                okButtonProps={{ htmlType: 'submit' }}
                onCancel={onCancel}
            >
                <div className="checkout-select-contract-modal-wrap">
                    <div className="search-wrap">
                        <TreeProjectSelect onTreeSelected={handleTreeSelected} width={324} isjustselect="true" />
                    </div>
                    <Table
                        rowSelection={rowSelection}
                        dataSource={data}
                        columns={columns}
                        size="small"
                        bordered
                        pagination={false}
                        className="contract-table"
                        scroll={{ x: 1100, y: 560 }}
                        loading={loading}
                    />
                </div>
            </Modal>
        </>
    );
};

export default SelectContractModal;
