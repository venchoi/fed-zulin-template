import React from 'react';
import { IStepData } from '@/types/meter';
interface IProps {
  unit: string;
  is_step: string; // TODO '0' | '1',
  price: string | number,
  step_data: IStepData[]
}
const PriceItem = ({ unit, is_step, price, step_data }: IProps) => {
  return (<>
    {!+is_step ? <div>{price}元{unit}</div> : <>
      {step_data.map((item, index) => (<div key={index}>{item.min ?? '0'}{unit}-{item.max ?? '不限'}{unit} {item.price}/{unit}</div>))}
    </>}
  </>)
}
export default PriceItem