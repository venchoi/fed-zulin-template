/**
 * 单价调整单详情页 —— 基本信息
 */
import React from 'react';
import { IAdjustmentDetail, IStepData } from '@/types/meter';
import FedDataSection from '@c/FedDataSection/FedDataSection';
import FedDataRow from '@c/FedDataSection/FedDataRow';
import FedUpload from '@c/FedUpload';
import { valueOf } from '@/types/global';
import { Badge } from 'antd';
import { find } from 'lodash';
import { statusItem } from '../config';
import PriceItem from './price';
import moment from 'moment';

interface IDataSection {
    label: '';
    value: valueOf<IAdjustmentDetail>;
}

const BaseInfo = ({ detail }: { detail: IAdjustmentDetail }) => {
    const baseInfoData = [
        [
            {
                label: '调整单号',
                value: detail.code,
            },
            {
                label: '状态',
                render: () => {
                    return <Badge color={find(statusItem, ['title', detail.status])?.color} text={detail.status} />;
                },
            },
            {
                label: '单价名称',
                value: detail.standard_name,
            },
            {
                label: '类型',
                value: detail.meter_type_name,
            },
            {
                label: '调整后单价',
                align: 'right',
                render: () => {
                    // @ts-ignore
                    const stepArr: IStepData[] = detail.step_data;
                    return (
                        <div>
                            <PriceItem {...detail} step_data={stepArr} highlight />
                        </div>
                    );
                },
            },
            {
                label: '生效时间',
                value: `${moment(detail.start_date).format('YYYY-MM-DD')}${detail.end_date ? ` 至 ${moment(detail.end_date).format('YYYY-MM-DD')}` : ''}`,
            },
            {
                label: '调整附件',
                value: detail.attachment,
                render: () => (
                    <>
                        <FedUpload readonly files={detail.attachment ? JSON.parse(detail.attachment) : []} />
                    </>
                ),
            },
        ],
    ];
    const systematicallyData = [
        [
            {
                label: '发起时间',
                value: detail.created_on,
            },
            {
                label: '发起人',
                value: detail.created_by_name,
            },
            {
                label: '审核时间',
                value: detail.audit_date,
            },
            {
                label: '审核人',
                value: detail.auditor_id_name,
            },
        ],
    ];
    const renderFedDataSection = (data: IDataSection[][]) => (
        <div className="baseinfo-content">
            {data.map((itemList, index) => (
                <div key={`baseinfo-item-${index}`} className="baseinfo-item">
                    {itemList.map(item => (
                        <FedDataRow key={item.label} rowData={item} valueWidth="auto"/>
                    ))}
                </div>
            ))}
        </div>
    );
    const baseInfoContent = renderFedDataSection(baseInfoData as IDataSection[][]);
    const systematicallyContent = renderFedDataSection(systematicallyData as IDataSection[][]);
    const sectionList = [
        {
            title: '调整单信息',
            content: baseInfoContent,
        },
        {
            title: '',
            content: systematicallyContent,
        },
    ];
    return (
        <>
            {sectionList.map(section => (
                <FedDataSection key={section.title} section={section} />
            ))}
        </>
    );
};
export default BaseInfo;
