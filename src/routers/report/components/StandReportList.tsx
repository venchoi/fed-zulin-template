import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, message, Spin } from 'antd';
import { getBasicReportList, importReport, checkIsExit } from '../../../services/report';
import Filter from '../components/Filter';
import FedTable from '../../../components/FedTable';
import FedPagination from '../../../components/FedPagination';

// types
import { ColumnProps } from 'antd/es/table';
import IRecordType from '../types';

const { confirm } = Modal;

const StandReportList = ({ columns: propsColumns = [] }: { columns: ColumnProps<IRecordType>[] }) => {
    const [basicReportParams, setBasicReportParams] = useState({
        keyword: '',
        page_index: 1,
        page_size: 20,
    });
    const [basicReportTotal, setBasicReportTotal] = useState(0);
    const [basicReportDataSource, setBasicReportDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = propsColumns.concat([
        {
            title: '操作',
            dataIndex: 'id',
            width: 194,
            render: (text, record, index) => {
                return (
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
    ]);

    const handleAddToMyReport = async (record: IRecordType) => {
        setLoading(true);
        const { result, data, errcode } = await checkIsExit({ id: record.id });
        setLoading(false);
        result && message.success('操作成功');
        if (errcode === 5001) {
            confirm({
                title: '报表已存在，是否覆盖？',
                icon: <ExclamationCircleOutlined />,
                onOk: async () => {
                    setLoading(true);
                    const { result } = await importReport({ id: record.id });
                    setLoading(false);
                    if (result) {
                        message.success('操作成功');
                        // TODO fetchMyReportList();
                    }
                },
            });
        }
        result && message.success('操作成功');
    };

    const fetchBasicReportList = async () => {
        setLoading(true);
        const { result, data } = await getBasicReportList({ ...basicReportParams });
        setLoading(false);
        if (result) {
            setBasicReportDataSource(data.list);
            setBasicReportTotal(data.total);
        }
    };
    useEffect(() => {
        fetchBasicReportList();
    }, []);

    useEffect(() => {
        fetchBasicReportList();
    }, [basicReportParams]);
    return (
        <Spin spinning={loading}>
            <Filter
                onFilterChange={filters => {
                    setBasicReportParams({ ...basicReportParams, ...filters });
                }}
                rightSlot={<></>}
            />
            <FedTable<IRecordType>
                vsides={false}
                rowKey="id"
                columns={columns}
                dataSource={basicReportDataSource}
                scroll={{
                    y: 'calc( 100vh - 365px )',
                }}
            />
            <FedPagination
                onShowSizeChange={(current, page_size) =>
                    setBasicReportParams({ ...basicReportParams, page_index: 1, page_size })
                }
                onChange={(page_index, page_size) => {
                    setBasicReportParams({
                        ...basicReportParams,
                        page_index: 1,
                        page_size: page_size || 20,
                    });
                }}
                current={basicReportParams.page_index}
                pageSize={basicReportParams.page_size}
                showTotal={total => `共${Math.ceil(+total / +(basicReportParams.page_size || 1))}页， ${total}条记录`}
                total={+basicReportTotal} /*  */
            />
        </Spin>
    );
};
export default StandReportList;
