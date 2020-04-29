import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { Tabs, Card, Pagination, Button, Modal, message, Spin } from 'antd';
import { getMyReportList, getBasicReportList, deleteReport, importReport, checkIsExit } from '../../services/report';
import Filter from './components/Filter';
import FedTable from '../../components/FedTable';
import FedPagination from '../../components/FedPagination';
import { getReportHref } from '../../helper/commonUtils';
import Edit from './Edit';

// types
import { History } from 'history';
import { ColumnProps } from 'antd/es/table';
import IRecordType from './types';

const { confirm } = Modal;

import './index.less';

interface IProps {
    history: History;
}

const ReportList = (props: IProps) => {
    const { history } = props;
    const [loading, setLoading] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('myreport');
    const [myReportDataSource, setMyReportDataSource] = useState([]);
    const [basicReportDataSource, setBasicReportDataSource] = useState([]);
    const [updateTime, setUpdateTime] = useState(''); // 最后更新时间
    const [showEditModal, setShowEditModal] = useState(false);

    const handleDownload = () => {
        const version = navigator.userAgent;
        if (version.indexOf('Mac OS') !== -1) {
            window.location.href = 'http://down.finereport.com/FineReport8.0-CN.dmg';
        } else {
            window.location.href = 'http://down.finereport.com/FineReport8.0-CN.exe';
        }
    };

    const fetchMyReportList = async () => {
        setLoading(true);
        const data = await getMyReportList({ page_index: 1, page_size: 20 });
        //@ts-ignore
        setMyReportDataSource(data.list);
        setLoading(false);
    };
    const fetchBasicReportList = async () => {
        setLoading(true);
        const data = await getBasicReportList({ page_index: 1, page_size: 20 });
        //@ts-ignore
        setBasicReportDataSource(data.list);
        setLoading(false);
    };

    const handleDelete = (record: IRecordType) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定删除该项？',
            onOk: async () => {
                const data = await deleteReport({ id: record.id });
                if (data) {
                    message.success('操作成功');
                    fetchMyReportList();
                }
            },
        });
    };

    const handleAddToMyReport = async (record: IRecordType) => {
        const data = await checkIsExit({ id: record.id });
        if (data.errcode === 5001) {
            confirm({
                title: '报表已存在，是否覆盖？',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    const data = await importReport({ id: record.id });
                    if (data) {
                        message.success('操作成功');
                        fetchMyReportList();
                    }
                },
            });
        }
    };

    useEffect(() => {
        fetchMyReportList();
        fetchBasicReportList();
    }, []);

    const tabList = [
        {
            key: 'myreport',
            tab: '我的报表123',
        },
        {
            key: 'basicreport',
            tab: '标准报表库',
        },
    ];

    const columns: ColumnProps<IRecordType>[] = [
        {
            dataIndex: 'name',
            title: '报表名称',
            render: (text, record, index) => {
                //判断是否是在标准报表库中
                // TODO
                // const { pms } = this.props;
                if (activeTabKey === 'myreport') {
                    //新增
                    return (
                        <span>
                            <a href={getReportHref({ id: record.id })} target="_blank" title={record.name}>
                                {record.name}
                            </a>
                            {!record.standard_id ? (
                                <span className="tag custom-report-tag" title="自定义报表">
                                    自
                                </span>
                            ) : (
                                ''
                            )}
                        </span>
                    );
                }
                return <>{text || '-'}</>;
            },
        },
        {
            dataIndex: 'rds_type',
            title: '报表类型',
            width: 160,
            render: (text, record, index) => {
                return <>{record.rds_type === 'rds_dm' ? 'DM数据源' : '租户数据源'}</>;
            },
        },
        {
            dataIndex: 'report_desc',
            title: '报表说明',
            width: 230,
            render: text => {
                return <>{text || '-'}</>;
            },
        },
        {
            ...(activeTabKey === 'myreport'
                ? {
                      dataIndex: 'report_update',
                      title: '最后更新时间',
                      width: 160,
                      // render: (text, record, index) => {
                      //     return <>{record.rds_type === 'rds_dm' ? updateTime || '-' : '-'}</>
                      // }
                  }
                : null),
        },
        {
            dataIndex: 'upload_by',
            title: '上传人',
            width: 110,
            render: text => {
                return <>{text || '-'}</>;
            },
        },
        {
            dataIndex: 'upload_on',
            title: '上传时间 ',
            width: 160,
            render: text => {
                return <>{text || '-'}</>;
            },
        },
        {
            title: '操作',
            dataIndex: 'id',
            width: 172,
            render: (text, record, index) => {
                return activeTabKey === 'myreport' ? (
                    <>
                        <Button type="link">修改</Button>
                        <Button type="link" onClick={() => handleDelete(record)}>
                            删除
                        </Button>
                        <Button type="link" href={record.download_url}>
                            下载
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="link" onClick={() => handleAddToMyReport(record)}>
                            添加到我的报表库
                        </Button>
                        <Button type="link" href={record.download_url}>
                            下载
                        </Button>
                    </>
                );
            },
        },
    ];

    return (
        <div className="report layout-list">
            <Card
                className="report-card"
                title="统计报表"
                // extra={<a href="#">More</a>}
                tabList={tabList}
                activeTabKey={activeTabKey}
                onTabChange={key => {
                    setActiveTabKey(key);
                }}
                // TODO tabProps
            >
                <Filter
                    rightSlot={
                        <>
                            <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                                下载报表工具
                            </Button>
                            <Button>从报表库中添加</Button>
                            <Button type="primary" onClick={() => setShowEditModal(true)}>
                                添加报表
                            </Button>
                        </>
                    }
                />
                <Spin spinning={loading}>
                    <FedTable<IRecordType>
                        bordered
                        pagination={false}
                        columns={columns}
                        dataSource={activeTabKey === 'myreport' ? myReportDataSource : basicReportDataSource}
                        scroll={{
                            y: 'calc( 100vh - 312px )',
                        }}
                    />
                    <FedPagination hideOnSinglePage showSizeChanger />
                </Spin>
                {showEditModal ? <Edit onOk={data => {}} /> : null}
            </Card>
        </div>
    );
};

export default ReportList;
