import React from 'react';
import { IStepData } from '@/types/meter';
import './price.less';
import { unitTransfer } from '@/helper/sringUtils';
interface IProps {
    unit: string;
    is_step: string; // TODO '0' | '1',
    price: string | number;
    step_data: IStepData[];
    highlight?: boolean;
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
