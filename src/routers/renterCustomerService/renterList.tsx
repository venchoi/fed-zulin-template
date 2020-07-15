import React, { useState, useEffect, useCallback } from 'react';
import { Divider, Button, Tabs, Badge, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SearchArea from './components/renterListSearchArea';
import FedPagination from '@c/FedPagination';
import FedTable from '@c/FedTable';
import { ColumnProps } from 'antd/es/table';
import { basicRenterListColumns } from './listComponent';
import { getRenterList } from '@s/renterCustomerService';
import { RenterListProps, renterListType, statusMapType } from './list.d';
import {
    getrenterListParams
} from '@/types/renterCustomerService';
import './renterList.less';

export const renterList = (props: RenterListProps) => {
    const { setLoading, setTotalSize, page, pageSize, stageId } = props;
    const [renterList, setRenterList] = useState<renterListType[]>([]);
    const [searchParams, setsearchParams] = useState<getrenterListParams>({
        stage_id: '',
        keyword: '',
        page: 1,
        page_size: 10,
        renter_type: '',
        contract_status: ''
    });

    useEffect(() => {
        setsearchParams({
            ...searchParams,
            page,
            page_size: pageSize
        });
    }, [page, pageSize]);

    useEffect(() => {
        setsearchParams({
            ...searchParams,
            stage_id: stageId
        });
    }, [stageId]);

    useEffect(() => {
        getRenterCustomerList();
    }, [searchParams]);

    // 获取租户管理员列表数据
    const getRenterCustomerList = async () => {
        let params = Object.assign({}, searchParams);
        if (!params.stage_id) {
            return;
        }
        setLoading(true);
        const { result, data } = await getRenterList(params);
        if (result && data) {
            setRenterList(data.items || []);
            setTotalSize(data.total);
        }
        setLoading(false);
    };

    const handleTableChange = () => {

    }

    const handleKeywordSearch = (value: string) => {
        setsearchParams({
            ...searchParams,
            keyword: value,
            page: 1,
        });
    };

    const columns: ColumnProps<renterListType>[]= [
        ...basicRenterListColumns,
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 140,
            render: (text: string, record: renterListType, index: number) => {
                return (<div className="op-col">
                    <Button
                        type="link"
                        className="operate-btn f-hidden renter-customers-service-change-manager"
                    >
                        更换管理员
                    </Button>
                    <Button
                        type="link"
                        className="f-hidden renter-customers-service-add-manager"
                    >
                        解绑
                    </Button>
                </div>)
            }
        },
    ];
    return (
        <div className="renter-list-page">
            <SearchArea 
                keywordValue={searchParams.keyword || ''}
                onKeywordSearch={handleKeywordSearch}
            />
            <FedTable<renterListType>
                className="renter-list-table"
                vsides={false}
                rowKey="id"
                columns={columns}
                dataSource={renterList}
                scroll={{
                    y: 'calc( 100vh - 340px )',
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}

export default renterList;