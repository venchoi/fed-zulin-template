import React, { useState, useEffect, useCallback, Dispatch } from 'react';
import { Card, message } from 'antd';
// @ts-ignore
import * as queryString from 'query-string';

import ContentLayout from '@c/FedListPageLayout';
import Filter from '../components/Filter';
import OutlayTable from '../components/OutlayTable';
import { projsValue } from '@t/project';
import { getOutlayList, getCanApplyInvoice, getStatistics } from '../service';
import { OutLayListItem, StatisticData, StageDataItem, GetOutlayListParams, FilterOptions } from '../type';
import { connect } from 'dva';
import OperateBar from '../components/OperateBar';
import TreeProjectSelect from '@/components/TreeProjectSelect';

import './index.less';

interface IProps {
    user: any;
    history: History;
    dispatch: Dispatch<{ type: string; data: any }>;
    outlay: { filterOptions: FilterOptions };
}

const OutlayList = (props: IProps) => {
    const {
        user,
        history,
        dispatch,
        outlay: { filterOptions },
    } = props;
    const queryStr = (location.search || '').replace(/^\?(.*)/, '$1');
    const query = queryString.parse(queryStr);
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [selectedProjectNames, setSelectedProjectNames] = useState<string[]>([]); // 当前选中的项目
    const [outlayList, setOutlayList] = useState<OutLayListItem[]>([]);
    const [outlayListTotal, setOutlayListTotal] = useState(0);
    const [stageData, setStageData] = useState<StageDataItem[]>([]); // 所有项目的打印模板
    const [statisticData, setStatisticData] = useState<StatisticData>({ income: '0', refund: '0' });
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<OutLayListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [canApplyInvoice, setCanApplyInvoice] = useState(false); // 是否开启了申请开票功能

    console.log('OutlayList construct filterOptions', filterOptions);

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
        const { stage_id } = filterOptions;
        console.log('===filterOptions change', filterOptions);
        if (!stage_id) {
            return;
        }
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

    const handleTreeSelected = (value: projsValue | string) => {
        const selectedProject = value as projsValue;
        const stageId = selectedProject.projIds.join(',');
        setSelectedProjectIds(selectedProject.projIds);
        setSelectedProjectNames(selectedProject.projNames);

        if (stageId && stageId !== filterOptions.stage_id) {
            dispatch({
                type: 'outlay/setFilterOptions',
                data: {
                    ...filterOptions,
                    page: 1,
                    stage_id: selectedProject.projIds.join(','),
                    room_id: '',
                    subdistrict_id: '',
                    building_id: '',
                    floor_name: '',
                },
            });
        }
    };

    /**
     * 处理搜索条件变化
     * @param filterParams
     */
    const handleFilterChange = (filterParams: GetOutlayListParams): void => {
        dispatch({
            type: 'outlay/setFilterOptions',
            data: {
                ...filterOptions,
                ...filterParams,
            },
        });
    };

    const handleTableSelect = (selectedRowKeys: string[], selectedRows: OutLayListItem[]) => {
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    };

    return (
        <ContentLayout
            className="outlay-list"
            title="收支管理"
            topRightSlot={
                <div className="project-select-area">
                    <TreeProjectSelect onTreeSelected={handleTreeSelected} width={328}></TreeProjectSelect>
                </div>
            }
        >
            <div>
                <Filter
                    onChange={handleFilterChange}
                    projIds={selectedProjectIds}
                    projNames={selectedProjectNames}
                    filterOptions={filterOptions}
                ></Filter>
                {selectedRowKeys.length > 0 && (
                    <OperateBar
                        selectedRows={selectedRows}
                        selectedRowKeys={selectedRowKeys}
                        stageData={stageData}
                        user={user}
                        canApplyInvoice={canApplyInvoice}
                        onClear={() => handleTableSelect([], [])}
                    />
                )}
                <OutlayTable
                    outlayList={outlayList}
                    outlayListTotal={outlayListTotal}
                    onPageSizeChange={(page_size: number) => {
                        console.log('page_size', page_size);
                    }}
                    onPageChange={(page_index: number, page_size: number) => {
                        handleFilterChange({
                            ...filterOptions,
                            page: page_size === filterOptions.page_size ? page_index : 1, // 页大小变化时，页数重置为1
                            page_size,
                        });
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
    outlay: state.outlay,
});

export default connect(mapStateToProps)(OutlayList);
