import React from 'react';
import { IStandardICURDParams, IStandardPriceDetail } from '@/types/meter';
import FedDataSection from '@c/FedDataSection/FedDataSection';
import FedDataRow from '@c/FedDataSection/FedDataRow';
import { valueOf } from '@/types/global';

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
                render: () => {
                    return (
                        <span style={{ color: '#F24F18' }}>
                            {(+detail.price).toFixed(2)}
                            {detail.unit}/月
                        </span>
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
