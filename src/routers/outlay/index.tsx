import React, { useState, useEffect, useCallback } from 'react';
import { Card, message } from 'antd';
// @ts-ignore
import * as queryString from 'query-string';

import ContentLayout from '@c/FedListPageLayout';
import Filter from './components/Filter';
import OutlayTable from './components/OutlayTable';
import TopRightFunc from './components/TopRightFunc';
import { GetOutlayListParams } from './index.d';
import { projsValue } from '@t/project';
import { getOutlayList, getCanApplyInvoice, getStatistics } from '@/services/outlay';
import { OutLayListItem, StatisticData, StageDataItem } from '@/types/outlay';
import { connect } from 'dva';

const OutlayList = (props: any) => {
    const { user, history } = props;
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
        page_size: 20,
    }); // 搜索参数
    const [outlayList, setOutlayList] = useState<OutLayListItem[]>([]);
    const [outlayListTotal, setOutlayListTotal] = useState(0);
    const [stageData, setStageData] = useState<StageDataItem[]>([]); // 所有项目的打印模板
    const [statisticData, setStatisticData] = useState<StatisticData>({ income: '0', refund: '0' });
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<OutLayListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [canApplyInvoice, setCanApplyInvoice] = useState(false); // 是否开启了申请开票功能

    useEffect(() => {
        console.log('outlay index', user, history);
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
        const getData = async () => {
            setLoading(true);
            const allData = await Promise.all([getOutlayList(filterOptions), getStatistics(filterOptions)]);
            setLoading(false);
            try {
                const [json1, json2] = allData;
                const { data: data1 } = json1;
                setOutlayList(data1.items || []);
                setOutlayListTotal(+data1.total || 0);
                setStageData(data1.stages);

                const { data: data2 } = json2;
                setStatisticData(data2);
            } catch (error) {
                message.error(error || '接口数据有误');
            }
        };
        getData();
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

    const handleTableSelect = (selectedRowKeys: string[], selectedRows: OutLayListItem[]) => {
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
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
                        extData={{ canApplyInvoice, stageData, user }}
                        selectedRows={selectedRows}
                        selectedRowKeys={selectedRowKeys}
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
                    onPageSizeChange={(page_size: number) => {
                        setFilterOptions({ ...filterOptions, page: 1, page_size });
                    }}
                    onPageChange={(page_index: number) => {
                        setFilterOptions({ ...filterOptions, page: page_index });
                    }}
                    page={filterOptions.page}
                    pageSize={filterOptions.page_size}
                    extData={{ canApplyInvoice, statisticData }}
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                    onTableSelect={handleTableSelect}
                    isTableLoading={loading}
                />
            </div>
        </ContentLayout>
    );
};

const mapStateToProps = (state: any) => ({
    user: state.main.user,
});

export default connect(mapStateToProps)(OutlayList);
