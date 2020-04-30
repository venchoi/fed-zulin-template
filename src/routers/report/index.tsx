import React, { useState, useEffect, useMemo } from 'react';
import { ExclamationCircleOutlined, DownloadOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Tabs, Card, Pagination, Button, Modal, message, Spin } from 'antd';
import {
    getMyReportList,
    getBasicReportList,
    deleteReport,
    importReport,
    checkIsExit,
    getUpdateStatus,
    updateReportRDS,
    editReport,
} from '../../services/report';
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
interface PageObj {
    page_index: number | number;
    page_size: number | undefined;
    total: number;
}

const ReportList = (props: IProps) => {
    const { history } = props;
    let updaterTimer: NodeJS.Timeout;
    const defaultEditItem: IRecordType = {
        id: '',
        name: '',
        desc: '',
        standard_id: '',
        rds_type: 'rds_tenant',
        upload_on: '',
        download_url: '',
    };
    const [myReportParams, setMyReportParams] = useState({
        keyword: '',
        page_index: 1,
        page_size: 20,
    });
    const [basicReportParams, setBasicReportParams] = useState({
        keyword: '',
        page_index: 1,
        page_size: 20,
    });
    const [editItem, setEditItem] = useState(defaultEditItem);
    const [myReportTotal, setMyReportTotal] = useState(0);
    const [basicReportTotal, setBasicReportTotal] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('myreport');
    const [myReportDataSource, setMyReportDataSource] = useState([]);
    const [basicReportDataSource, setBasicReportDataSource] = useState([]);
    const [updateTime, setUpdateTime] = useState(''); // 最后更新时间
    const [showEditModal, setShowEditModal] = useState(false);

    const pageObj = useMemo(() => {
        return {
            page_size: (activeTabKey === 'myreport' ? myReportParams : basicReportParams).page_size,
            page_index: (activeTabKey === 'myreport' ? myReportParams : basicReportParams).page_index,
            total: activeTabKey === 'myreport' ? myReportTotal : basicReportTotal,
        };
    }, [myReportParams, basicReportParams, myReportTotal, basicReportTotal, activeTabKey]);

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
        const data = await getMyReportList({ ...myReportParams });
        setMyReportDataSource(data.list);
        setMyReportTotal(data.total);
        setLoading(false);
    };
    const fetchBasicReportList = async () => {
        setLoading(true);
        const data = await getBasicReportList({ ...basicReportParams });
        setBasicReportDataSource(data.list);
        setBasicReportTotal(data.total);
        setLoading(false);
    };

    const handleEdit = (record: IRecordType) => {
        setEditItem(record);
        setShowEditModal(true);
    };

    const handleDelete = (record: IRecordType) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定删除该项？',
            onOk: async () => {
                setLoading(true);
                const data = await deleteReport({ id: record.id });
                setLoading(false);
                if (data) {
                    message.success('操作成功');
                    fetchMyReportList();
                }
            },
        });
    };

    const handleAddToMyReport = async (record: IRecordType) => {
        setLoading(true);
        const data = await checkIsExit({ id: record.id });
        console.log(data);
        setLoading(false);
        if (data?.errcode === 5001) {
            confirm({
                title: '报表已存在，是否覆盖？',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    setLoading(true);
                    const data = await importReport({ id: record.id });
                    setLoading(false);
                    message.success('操作成功');
                    fetchMyReportList();
                },
            });
        }
        data && message.success('操作成功');
    };

    const handleUpdateStatus = () => {
        confirm({
            title: '确定更新？',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const data = await updateReportRDS();
            },
        });
    };
    // @ts-ignore
    const handleOk = async params => {
        const data = await editReport(params);
        message.success(params.id ? '修改成功' : '添加成功');
        fetchMyReportList();
    };

    const fetchReportUpdateStatus = (waiting = false) => {
        clearTimeout(updaterTimer);
        updaterTimer = setTimeout(
            async () => {
                setUpdating(true);
                const data = await getUpdateStatus();

                console.log(data);
                setTimeout(() => {
                    setUpdating(data.status === '未完成');
                }, 2000);
                setUpdateTime((data.status === '已完成' ? data.modified_on : data.last_finish_time) || '');
                data.status === '未完成' && fetchReportUpdateStatus(true);
            },
            waiting ? 5000 : 0
        );
    };

    useEffect(() => {
        fetchMyReportList();
        fetchBasicReportList();
        activeTabKey === 'myreport' && fetchReportUpdateStatus(false);
    }, []);

    useEffect(() => {
        fetchMyReportList();
    }, [myReportParams]);

    useEffect(() => {
        fetchBasicReportList();
    }, [basicReportParams]);

    const tabList = [
        {
            key: 'myreport',
            tab: '我的报表',
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
            dataIndex: 'desc',
            title: '报表说明',
            width: 230,
            render: text => {
                return <>{text || '-'}</>;
            },
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
                        <Button type="link" onClick={() => handleEdit(record)}>
                            修改
                        </Button>
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
                    onFilterChange={filters => {
                        setMyReportParams({ ...myReportParams, ...filters });
                    }}
                    rightSlot={
                        activeTabKey === 'myreport' ? (
                            <>
                                {updateTime ? (
                                    <span className="report-updating-text report-updating-tip">
                                        上次更新: {updateTime}
                                    </span>
                                ) : null}
                                {updating ? (
                                    <>
                                        <LoadingOutlined style={{ color: '#248BF2' }} />
                                        <span className="report-updating-text report-updating-tip">报表刷新中…</span>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => handleUpdateStatus()} type="link">
                                            <SyncOutlined style={{ color: '#248BF2' }} spin={false} />
                                            <span className="report-updating-text report-updating-action">
                                                更新报表
                                            </span>
                                        </Button>
                                    </>
                                )}
                                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                                    下载报表工具
                                </Button>
                                <Button onClick={() => setActiveTabKey('basicreport')}>从报表库中添加</Button>
                                <Button type="primary" onClick={() => setShowEditModal(true)}>
                                    添加报表
                                </Button>
                            </>
                        ) : (
                            <></>
                        )
                    }
                />
                <Spin spinning={loading}>
                    <FedTable<IRecordType>
                        bordered
                        pagination={false}
                        columns={columns}
                        dataSource={activeTabKey === 'myreport' ? myReportDataSource : basicReportDataSource}
                        scroll={{
                            y: 'calc( 100vh - 360px )',
                        }}
                    />
                    <FedPagination
                        hideOnSinglePage
                        showSizeChanger
                        onShowSizeChange={(current, page_size) => {
                            activeTabKey === 'myreport'
                                ? setMyReportParams({ ...myReportParams, page_index: 1, page_size })
                                : setBasicReportParams({ ...basicReportParams, page_index: 1, page_size });
                        }}
                        pageSizeOptions={['10', '20', '30', '50']}
                        onChange={(page_index, page_size) => {
                            activeTabKey === 'myreport'
                                ? setMyReportParams({ ...myReportParams, page_index, page_size: page_size || 20 })
                                : setBasicReportParams({
                                      ...basicReportParams,
                                      page_index: 1,
                                      page_size: page_size || 20,
                                  });
                        }}
                        defaultCurrent={1}
                        current={pageObj.page_index}
                        pageSize={pageObj.page_size}
                        showTotal={total => `共${Math.ceil(+total / +(pageObj.page_size || 1))}页/${total}条`}
                        total={+pageObj.total}
                    />
                </Spin>
                {showEditModal ? (
                    <Edit onOk={data => handleOk(data)} onCancel={() => setShowEditModal(false)} detail={editItem} />
                ) : null}
            </Card>
        </div>
    );
};

export default ReportList;
