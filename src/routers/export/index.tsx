import React, { useState, useEffect } from 'react';
import { PageHeader } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { getExportList } from '@s/export';
import { match } from 'react-router';
import ExportCard from './exporList';

interface HistoryParams {
    type: string;
    stageId: string;
}
interface Match extends match {
    params: HistoryParams;
}

interface Props extends RouteComponentProps {
    match: Match;
}

const exportList = ({ match: { params } }: Props) => {
    const { type = '', stageId = '' } = params;

    const fetchExportList = async () => {
        const { data, result } = await getExportList({ stage_id: stageId, type: '营业额管理', page: 1, page_size: 20 });
        console.log(data);
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
    }, [type, stageId]);

    return (
        <div>
            <PageHeader title="导出记录" breadcrumb={{ routes }} ghost={false} />
            <div className="layout-list">
                <ExportCard />
            </div>
        </div>
    );
};
export default exportList;
