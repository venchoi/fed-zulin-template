import React, { useState, useEffect } from 'react';
import { PageHeader } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { match } from 'react-router';
import { Route } from 'antd/es/breadcrumb/Breadcrumb.d';
import { getExportList } from '@s/export';
import { useThrottleFn } from '@/helper/customHooks';
import ExportCard from './exporList';
import { exportConfig } from './exportConfig';
import { Status, ExportType, IHistoryParams, IExportCardParams } from '@/types/export';
import './index.less';

interface IMatch extends match {
    params: IHistoryParams;
}

interface IProps extends RouteComponentProps {
    match: IMatch;
}

const exportList = ({ match: { params } }: IProps) => {
    const { type, stage_id = '' } = params;
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);

    const { run: fetchExportList } = useThrottleFn(async (payload: IExportCardParams = {}) => {
        const { data, result } = await getExportList({ stage_id, type, page: 1, page_size: 20, ...payload });
        setDataSource(data?.items || []);
        setTotal(+data?.total || 0);
    }, 500);

    const routes = [
        {
            path: exportConfig[type].backUrl,
            breadcrumbName: exportConfig[type].name,
        },
        {
            path: '',
            breadcrumbName: `导出记录${type ? ` - ${type}` : ''}`,
        },
    ];

    useEffect(() => {
        fetchExportList();
    }, [type, stage_id]);

    const itemRender = (route: Route) => {
        if (route.path) {
            return (
                <a href={route.path} key={route.path}>
                    {route.breadcrumbName}
                </a>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };

    return (
        <>
            <PageHeader title="导出记录" breadcrumb={{ routes, itemRender }} ghost={false} />
            <div className="layout-list">
                <ExportCard dataSource={dataSource} paramsChange={payload => fetchExportList(payload)} total={total} />
            </div>
        </>
    );
};
export default exportList;
