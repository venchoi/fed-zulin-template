import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ExclamationCircleOutlined, DownloadOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Tabs, Card, Pagination, Button, Modal, message, Spin } from 'antd';
import { getMyReportList, deleteReport, getUpdateStatus, updateReportRDS, editReport } from '../../../services/report';
import Filter from '../components/Filter';
import FedTable from '../../../components/FedTable';
import FedPagination from '../../../components/FedPagination';
import Edit from '../Edit';

// types
import { ColumnProps } from 'antd/es/table';
import IRecordType from '../types';

const { confirm } = Modal;
const { TabPane } = Tabs;

interface IProps {
    columns: ColumnProps<IRecordType>[];
    setActiveTabKey: Dispatch<SetStateAction<string>>;
}

const MyReportList = ({ columns: propsColumns = [], setActiveTabKey }: IProps) => {
    const defaultEditItem: IRecordType = {
        id: '',
        name: '',
        desc: '',
        standard_id: '',
        rds_type: 'rds_tenant',
        upload_on: '',
        download_url: '',
        report_file: '',
    };
    let updaterTimer: NodeJS.Timeout;
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [myReportTotal, setMyReportTotal] = useState(0);
    const [editItem, setEditItem] = useState(defaultEditItem);
    const [updateTime, setUpdateTime] = useState(''); // 最后更新时间
    const [myReportParams, setMyReportParams] = useState({
        keyword: '',
        page_index: 1,
        page_size: 20,
    });
    const [myReportDataSource, setMyReportDataSource] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);

    const columns = propsColumns.concat([
        {
            title: '操作',
            dataIndex: 'id',
            width: 194,
            render: (text, record, index) => {
                return (
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
                );
            },
        },
    ]);

    const handleDelete = (record: IRecordType) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确定删除该项？',
            onOk: async () => {
                setLoading(true);
                const { result, data } = await deleteReport({ id: record.id });
                setLoading(false);
                if (result) {
                    message.success('操作成功');
                    fetchMyReportList();
                }
            },
        });
    };

    // @ts-ignore
    const handleOk = async params => {
        const { result } = await editReport(params);
        if (result) {
            message.success(params.id ? '修改成功' : '添加成功');
            setShowEditModal(false);
            fetchMyReportList();
        }
    };

    const fetchMyReportList = async () => {
        setLoading(true);
        const { result, data } = await getMyReportList({ ...myReportParams });
        setLoading(false);
        if (result) {
            setMyReportDataSource(data.list);
            setMyReportTotal(data.total);
        }
    };

    const handleDownload = () => {
        const agent = navigator.userAgent.toLocaleLowerCase();
        if (agent.indexOf('mac os') !== -1) {
            window.location.href =
                'https://fine-build.oss-cn-shanghai.aliyuncs.com/finereport/10.0/stable/exe/macos_FineReport-CN.dmg';
        } else {
            window.location.href =
                agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0
                    ? 'https://fine-build.oss-cn-shanghai.aliyuncs.com/finereport/10.0/stable/exe/windows_x64_FineReport-CN.exe'
                    : 'https://fine-build.oss-cn-shanghai.aliyuncs.com/finereport/10.0/stable/exe/windows_x86_FineReport-CN.exe';
        }
    };

    const handleUpdateStatus = () => {
        confirm({
            title: '确定更新？',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const data = await updateReportRDS();
                // TODO
            },
        });
    };

    const fetchReportUpdateStatus = (waiting = false) => {
        clearTimeout(updaterTimer);
        updaterTimer = setTimeout(
            async () => {
                setUpdating(true);
                const { result, data } = await getUpdateStatus();
                if (result) {
                    setTimeout(() => {
                        setUpdating(data.status === '未完成');
                    }, 2000);
                    setUpdateTime((data.status === '已完成' ? data.modified_on : data.last_finish_time) || '');
                    data.status === '未完成' && fetchReportUpdateStatus(true);
                }
            },
            waiting ? 5000 : 0
        );
    };

    const handleEdit = (record: IRecordType) => {
        setEditItem(record);
        setShowEditModal(true);
    };

    useEffect(() => {
        fetchMyReportList();
        fetchReportUpdateStatus(false);
    }, []);

    useEffect(() => {
        fetchMyReportList();
    }, [myReportParams]);

    return (
        <>
            <Spin spinning={loading}>
                <Filter
                    onFilterChange={filters => {
                        setMyReportParams({ ...myReportParams, ...filters });
                    }}
                    rightSlot={
                        <>
                            {updateTime ? (
                                <span className="report-updating-text report-updating-tip">上次更新: {updateTime}</span>
                            ) : null}
                            {updating ? (
                                <>
                                    <LoadingOutlined style={{ color: '#248BF2', padding: '0 8px' }} />
                                    <span className="report-updating-text report-updating-tip report-updating-ing">
                                        报表刷新中…
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => handleUpdateStatus()} type="link">
                                        <SyncOutlined style={{ color: '#248BF2' }} spin={false} />
                                        <span className="report-updating-text report-updating-action">更新报表</span>
                                    </Button>
                                </>
                            )}
                            <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                                下载报表工具
                            </Button>
                            <Button type="primary" ghost onClick={() => setActiveTabKey('basicreport')}>
                                从报表库中添加
                            </Button>
                            <Button type="primary" onClick={() => setShowEditModal(true)}>
                                添加报表
                            </Button>
                        </>
                    }
                />
                <FedTable<IRecordType>
                    vsides={false}
                    rowKey="id"
                    columns={columns}
                    dataSource={myReportDataSource}
                    scroll={{
                        y: 'calc( 100vh - 365px )',
                    }}
                />
                <FedPagination
                    onShowSizeChange={(current, page_size) => {
                        setMyReportParams({ ...myReportParams, page_index: 1, page_size });
                    }}
                    onChange={(page_index, page_size) => {
                        setMyReportParams({ ...myReportParams, page_index, page_size: page_size || 20 });
                    }}
                    current={myReportParams.page_index}
                    pageSize={myReportParams.page_size}
                    showTotal={total => `共${Math.ceil(+total / +(myReportParams.page_size || 1))}页， ${total}条记录`}
                    total={+myReportTotal}
                />
            </Spin>
            {showEditModal ? (
                <Edit onOk={data => handleOk(data)} onCancel={() => setShowEditModal(false)} detail={editItem} />
            ) : null}
        </>
    );
};
export default MyReportList;
