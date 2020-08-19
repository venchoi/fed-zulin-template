/**
 * 选择退租合同弹框
 * 包括 筛选条件 与 合同信息
 */
import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import TreeProjectSelect from '@c/TreeProjectSelect';
import './contractShowTable.less';

interface IProps {
    onCancel: () => void;
    onOk?: () => void;
}

interface projectsValue {
    projIds: Array<string>;
    projNames: Array<string>;
}

const rowSelection = {
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
                // return <Link to="/asset-holder/list">{item}</Link>;
            },
            width: 209,
            fixed: 'left',
        },
        {
            title: '资源名称',
            dataIndex: 'time',
            key: 'time',
            width: 330,
        },
        {
            title: '承租方',
            dataIndex: 'project',
            key: 'project',
            width: 245,
        },
        {
            title: '合同期限',
            dataIndex: 'project1',
            key: 'project1',
        },
    ];
    const data = [
        {
            key: '1',
            code: 'TZ20200726015428838',
            time: '5地块-11栋-华银路19号02幢-102室',
            project: '南京亿宏佳通讯科技有限公司',
            project1: '2019-08-08 至 2020-08-08',
        },
        {
            key: '2',
            code: 'TZ20200726015428839',
            time: '打包资源名称：四组团-（11地块）12幢-商铺',
            project: '南京亿宏佳通讯科技有限公司',
            project1: '2019-08-08 至 2020-08-08',
        },
        {
            key: '3',
            code: 'TZ20200726015428839',
            time: '5地块-11栋-华银路19号02幢-102室',
            project: '南京亿宏佳通讯科技有限公司',
            project1: '2019-08-08 至 2020-08-08',
        },
    ];

    // 获取数据
    const getContract = () => {
        // contract/contract/list
    };

    // 切换项目回调
    const handleTreeSelected = (selectedProject: projectsValue) => {
        console.log('projsValue', selectedProject);
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
                        rowSelection={{
                            type: 'radio',
                            ...rowSelection,
                        }}
                        dataSource={data}
                        columns={columns}
                        size="small"
                        bordered
                        pagination={false}
                        className="contract-table"
                        scroll={{ x: 1100 }}
                    />
                </div>
            </Modal>
        </>
    );
};

export default SelectContractModal;
