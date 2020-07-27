import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
// @ts-ignore
import * as queryString from 'query-string';

import ContentLayout from '@c/FedListPageLayout';
import Filter from './components/Filter';
import OutlayTable from './components/OutlayTable';
import TopRightFunc from './components/TopRightFunc';
import { GetOutlayListParams } from './index.d';
import { projsValue } from '@t/project';
import { getOutlayList, getCanApplyInvoice } from '@/services/outlay';
import { OutLayListItem } from '@/types/outlay';

const OutlayList = (props: any) => {
    const { history } = props;
    const queryStr = (location.search || '').replace(/^\?(.*)/, '$1');
    const query = queryString.parse(queryStr);
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [selectedProjectNames, setSelectedProjectNames] = useState<string[]>([]); // 当前选中的项目
    const [filterOptions, setFilterOptions] = useState({
        stage_id: '',
        subdistrict_id: '',
        building_id: '',
        floor_name: '',
        room_id: '',
        fee_name: '',
        payment_mode_id: '',
        keyword: query.keyword || '',
        start_date: '', // 支付开始时间
        end_date: '', // 支付结束时间
        exchange_end_date: '',
        exchange_start_date: '',
        page: 1,
        page_size: 10,
    }); // 搜索参数
    const [outlayList, setOutlayList] = useState<OutLayListItem[]>([]);
    const [outlayListTotal, setOutlayListTotal] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [canApplyInvoice, setCanApplyInvoice] = useState(false); // 是否开启了申请开票功能

    useEffect(() => {
        getCanApplyInvoice().then(json => {
            try {
                const {
                    data: { apply_receipt },
                } = json;
                setCanApplyInvoice(+apply_receipt === 1);
            } catch (error) {
                message.error(error || '接口数据有误');
            }
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        getOutlayList(filterOptions).then(json => {
            try {
                const { data } = json;
                setOutlayList(data.items || []);
                setOutlayListTotal(+data.total || 0);
                setLoading(false);
            } catch (error) {
                message.error(error || '接口数据有误');
            }
        });
    }, [filterOptions]);

    /**
     * 处理右上角功能区的功能
     * @param type 类型[project|]
     * @param value
     */
    const handleTopRightFunc = (type: string, value: projsValue | string) => {
        switch (type) {
            case 'project':
                const selectedProject = value as projsValue;
                setSelectedProjectIds(selectedProject.projIds);
                setSelectedProjectNames(selectedProject.projNames);
                setFilterOptions({
                    ...filterOptions,
                    page: 1,
                    stage_id: selectedProject.projIds.join(','),
                });
                break;
        }
    };

    /**
     * 处理搜索条件变化
     * @param filterParams
     */
    const handleFilterChange = (filterParams: GetOutlayListParams): void => {
        console.log('filterParams', filterParams);
        setFilterOptions({
            ...filterOptions,
            ...filterParams,
        });
    };

    return (
        <ContentLayout
            className="outlay-page"
            title="收支管理"
            topRightSlot={
                <div className="project-select-area">
                    <TopRightFunc
                        onChange={handleTopRightFunc}
                        projIds={selectedProjectIds}
                        projNames={selectedProjectNames}
                    ></TopRightFunc>
                </div>
            }
        >
            <div>
                {selectedProjectIds.length > 0 && (
                    <Filter
                        onChange={handleFilterChange}
                        projIds={selectedProjectIds}
                        projNames={selectedProjectNames}
                        filterOptions={filterOptions}
                    ></Filter>
                )}
                <OutlayTable
                    outlayList={outlayList}
                    outlayListTotal={outlayListTotal}
                    loading={loading}
                    onPageSizeChange={(current: number, page_size: number) => {
                        setFilterOptions({ ...filterOptions, page: 1, page_size });
                    }}
                    onPageChange={(page_index: number, page_size: number) => {
                        setFilterOptions({ ...filterOptions, page: page_index, page_size: page_size || 10 });
                    }}
                    page={filterOptions.page}
                    pageSize={filterOptions.page_size}
                    extData={{ CanApplyInvoice: canApplyInvoice }}
                />
            </div>
        </ContentLayout>
    );
};

export default OutlayList;
