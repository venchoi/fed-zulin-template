/**
 * 标准单价详情页 —— 基本信息
 */
import React from 'react';
import { IStandardICURDParams, IStandardPriceDetail } from '@/types/meter';
import FedDataSection from '@c/FedDataSection/FedDataSection';
import FedDataRow from '@c/FedDataSection/FedDataRow';
import { valueOf } from '@/types/global';
import PriceItem from './price';
import moment from 'moment';

interface IDataSection {
    label: '';
    value: valueOf<IStandardPriceDetail>;
}

const BaseInfo = ({ detail }: { detail: IStandardPriceDetail }) => {
    const baseInfoData = [
        [
            {
                label: '名称',
                value: detail.name,
            },
            {
                label: '类型',
                value: detail.meter_type_name,
            },
            {
                label: '单价',
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
                label: '说明',
                value: detail.remark,
            },
            {
                label: '生效时间',
                value: detail.effect_date,
                render: () => {
                    return (
                        <>
                          {moment(detail.effect_date).format('YYYY-MM-DD')}  
                        </>
                    );
                },
            },
        ],
    ];
    const systematicallyData = [
        [
            {
                label: '创建时间',
                value: detail.created_on,
            },
            {
                label: '创建人',
                value: detail.created_by_name,
            },
        ],
    ];
    const renderFedDataSection = (data: IDataSection[][]) => (
        <div className="baseinfo-content">
            {data.map((itemList, index) => (
                <div key={`baseinfo-item-${index}`} className="baseinfo-item">
                    {itemList.map(item => (
                        <FedDataRow key={item.label} rowData={item} />
                    ))}
                </div>
            ))}
        </div>
    );
    const baseInfoContent = renderFedDataSection(baseInfoData as IDataSection[][]);
    const systematicallyContent = renderFedDataSection(systematicallyData as IDataSection[][]);
    const sectionList = [
        {
            title: '基本信息',
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
