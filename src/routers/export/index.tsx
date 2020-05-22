import React, { useState, useEffect } from 'react';
import { PageHeader } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { match } from 'react-router';
import { getExportList } from '@s/export';
import ExportCard from './exporList';
import { Status, ExportType, IHistoryParams, IExportCardParams } from '@t/exportTypes';

interface IMatch extends match {
    params: IHistoryParams;
}

interface IProps extends RouteComponentProps {
    match: IMatch;
}

const exportList = ({ match: { params } }: IProps) => {
    const { type = ExportType.DEFAULT, stage_id = '' } = params;
    const [dataSource, setDataSource] = useState([]);

    const fetchExportList = async (payload: IExportCardParams = {}) => {
        // TODO page？
        const { data, result } = await getExportList({ stage_id, type, page: 1, page_size: 10, ...payload });
        setDataSource(data?.items || []);
    };
    const routes = [
        {
            path: '/business-volume/list',
            breadcrumbName: '营业额管理',
        },
        {
            path: '/',
            breadcrumbName: '导出记录',
        },
    ];

    useEffect(() => {
        fetchExportList();
    }, [type, stage_id]);

    return (
        <>
            <PageHeader title="导出记录" breadcrumb={{ routes }} ghost={false} />
            <div className="layout-list">
                <ExportCard dataSource={dataSource} paramsChange={payload => fetchExportList(payload)} />
            </div>
        </>
    );
};
export default exportList;
