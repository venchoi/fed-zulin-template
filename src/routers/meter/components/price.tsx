/**
 * 单价价格显示component
 * 列表页 详情页等都有用到
 */
import React from 'react';
import { IStepData } from '@/types/meter';
import './price.less';
import { unitTransfer } from '@/helper/sringUtils';
interface IProps {
    unit: string; // 单位
    is_step: string; // TODO '0' | '1', // 是否阶梯价
    price: string | number; // 标准单价
    step_data: IStepData[]; // 阶梯价
    highlight?: boolean; // 价格颜色
}
const PriceItem = ({ unit, is_step, price, step_data, highlight }: IProps) => {
    return (
        <div className="price-item-container">
            {!+is_step ? (
                <div className={`price ${highlight ? 'highlight' : ''}`}>
                    {price}元/{unitTransfer(unit)}
                </div>
            ) : (
                <>
                    {step_data.map((item, index) => (
                        <div key={index} className="price-item">
                            <span className="step">
                                {index === step_data.length - 1 ? '>' : ''}
                                {item.min ?? '≤'}
                                {item.min && index !== step_data.length - 1 ? '-' : ''}
                                {item.max ?? '不限'}
                                {unitTransfer(unit)}:
                            </span>
                            <span className={`price ${highlight ? 'highlight' : ''}`}>
                                {item.price}元/{unitTransfer(unit)}
                            </span>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};
export default PriceItem;
