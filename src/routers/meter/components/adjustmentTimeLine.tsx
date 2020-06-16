import React, { useEffect, useState } from 'react';
// import { Slider } from 'antd'
import { Chart, Geom, Axis, Tooltip, Legend, Interaction, StepLineChart, Slider } from 'bizcharts';
import { cloneDeep } from 'lodash';
import moment, { Moment } from 'moment';
import { IStandardPriceRecord, IStepData, IAdjustmentItem } from '@t/meter';
import { getStandardPriceRecord } from '@s/meter';
import { unitTransfer } from '@/helper/sringUtils';
const colorPlatte = ['#5EB9FF', '#36A1FF', '#0D86FF', '#0065D9', '#004DB3', '#00388C', '#00388C', '#00388C', '#00388C'];

interface IProps {
    id: string;
}
interface IState {
    data: ITimeItem[];
    rangeDate: Moment[];
}
interface ITimeItem {
    price: number;
    date: string;
    unit: string,
    is_step: string, // 是否阶梯价
    series: string,
    index: number, // 第几个线，防止不同时间区间 相同的阶梯的线被合并，用step_data的索引来标识区间的唯一拼接到sereis字段中
    [key: string]: string | number | undefined;
}
class AdjustmentChart extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            data: [],
            rangeDate: [moment().subtract(20, 'year'), moment().add(2, 'year')],
        };
    }
    public componentDidMount() {
        this.fetchData();
    }
    //  从 start 到 end , 每天都填充一个点 price
    public fillTimeLine = (start: Moment, end: Moment | string, item: IStandardPriceRecord, timeIndex: number) => {
        let result: ITimeItem[] = []
        while(start.isBefore(end, 'day')) {
            if (item.is_step === '1') {
                // @ts-ignore
                const stepResult = this.handleStepData(item.step_data, start, item, timeIndex)
                result = result.concat(stepResult);
            } else {
                result.push({
                    date: start.format('YYYY-MM-DD'),
                    price: +item.price,
                    unit: unitTransfer(item.unit),
                    is_step: item.is_step,
                    index: timeIndex,
                    series: `${item.price}${unitTransfer(item.unit)}__${timeIndex}`
                })
            }
            start.add(1, 'd');
        }
        return result
    }
    // 阶梯价将会生成多个线上的点，date和price不变，series为阶梯的标识
    public handleStepData = (stepData: IStepData[], date: Moment, standardPriceItem: IStandardPriceRecord, timeIndex: number) => {
        let result: ITimeItem[] = []
        stepData.map((item, index) => {
            const isFirst = !item.min
            const isEnd = !item.max
            const seriesName = isFirst ? `≤ ${item.max}${unitTransfer(standardPriceItem.unit)}` : (isEnd ? `＞${item.min}${unitTransfer(standardPriceItem.unit)}` : `${item.min}~${item.max}${unitTransfer(standardPriceItem.unit)}`) 
            result.push({
                date: date.format('YYYY-MM-DD'),
                price: +item.price,
                is_step: '1',
                unit: unitTransfer(standardPriceItem.unit),
                index: timeIndex,
                series: `${seriesName}__${timeIndex}`,
            })
        })
        return result
    }
    public handleTimeLine = (timeLine: IStandardPriceRecord[]): ITimeItem[] => {
        let flatTimeLine: ITimeItem[] = []; //  填充后的点的数据
        const { rangeDate } = this.state
        timeLine.map((item, timeIndex) => {
            // item区间数据，可能为点
            const start = item.start_date // 第一个区间的起始时间
            const end = item.end_date // 第一个区间的结束时间
            const momentStart = moment(start, 'YYYY-MM-DD')
            if (start === end) {
                // 点： 起始时间 === 结束时间时，为一个点，直接推
                flatTimeLine.push({
                    date: start,
                    price: +item.price,
                    is_step: item.is_step,
                    unit: unitTransfer(item.unit),
                    index: timeIndex,
                    series: `${item.price}元/${unitTransfer(item.unit)}/月__${timeIndex}`
                })
            } else {
                // 区间：如果有调整单的结束时间取调整单的结束时间，没有的话去筛选条件（默认）的结束时间
                const result = this.fillTimeLine(momentStart, end || rangeDate[1], item, timeIndex)
                flatTimeLine =  flatTimeLine.concat(result)
            }
        })
        return flatTimeLine;
    }
    public fetchData = async () => {
        const { id } = this.props;
        const { rangeDate } = this.state;
        const start_date = rangeDate[0].format('YYYY-MM-DD');
        const end_date = rangeDate[1].format('YYYY-MM-DD');
        let { data = [] } = await getStandardPriceRecord({ meter_standard_price_id: id, start_date, end_date });
        data.map((item: IStandardPriceRecord) => {
            item.step_data = JSON.parse(item.step_data)
            return item
        })
        let timeLine: ITimeItem[] = this.handleTimeLine(data)
        this.setState({
            data: timeLine,
        });
    };
    public handleSliderChange = () => {}
    public render() {
        const { data } = this.state;
        const cols = {
            price: {
                alias: '单价',
                min: 0,
            },
        };
        return (
            <>
                <StepLineChart
                    data={data}
                    // 标题 这里不需要展示title
                    title={{
                        visible: false,
                        text: '单价变动折线图',
                    }}
                    // 描述
                    description={{
                        visible: true,
                        text: '单位:(元/月)',
                    }}
                    // 图例
                    legend={{
                        visible: false,
                    }}
                    // 线的配色板
                    color={colorPlatte}
                    // x轴字段
                    xField='date'
                    // y轴字段
                    yField='price'
                    seriesField="series"
                    // 交互: slider 底部滑动条
                    interactions={[{
                        type: 'slider'
                    }]}
                    tooltip={{
                        formatter: (date, price, series, is_step, unit, index) => {
                            const originName = !!+is_step ? series : `每${unit}`
                            return {
                                name: originName.split('__')[0],
                                value: price
                            }
                        },
                        fields: ['date', 'price', 'series', 'is_step', 'unit', 'index'],
                        domStyles: {
                            'g2-tooltop': {
                                background: 'rgba(0, 0, 0, 0.75)'
                            }
                        }
                    }}
                    step="vh"
                />
            </>
        );
    }
}
export default AdjustmentChart;
