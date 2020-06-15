import React, { useEffect, useState } from 'react';
// import { Slider } from 'antd'
import { Chart, Geom, Axis, Tooltip, Legend, Interaction } from 'bizcharts';
import DataSet from "@antv/data-set";
import { cloneDeep } from 'lodash';
import moment, { Moment } from 'moment';
import { IStandardPriceRecord, IStepData, IAdjustmentItem } from '@t/meter';
import { getStandardPriceRecord } from '@s/meter';
const colorPlatte = ['#5EB9FF', '#36A1FF', '#0D86FF', '#0065D9', '#004DB3', '#00388C'];

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
    [key: string]: string | number;
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
    public fillTimeLine = (start: Moment, end: Moment | string, item: IStandardPriceRecord) => {
        let result: ITimeItem[] = []
        while(start.isBefore(end, 'day')) {
            if (item.is_step === '1') {
                // @ts-ignore
                const stepResult = this.handleStepData(item.step_data, start)
                console.log(stepResult)
                result = result.concat(stepResult);
            } else {
                result.push({
                    date: start.format('YYYY-MM-DD'),
                    price: +item.price,
                    series: `series1`
                })
            }
            start.add(1, 'd');
        }
        return result
    }
    public handleStepData = (stepData: IStepData[], date: Moment) => {
        let result: ITimeItem[] = []
        stepData.map((item, index) => {
            result.push({
                date: date.format('YYYY-MM-DD'),
                price: +item.price,
                series: `series${index + 1}`
            })
        })
        return result
    }
    public handleTimeLine = (timeLine: IStandardPriceRecord[]): ITimeItem[] => {
        let flatTimeLine: ITimeItem[] = []; //  填充后的点的数据
        const { rangeDate } = this.state
        timeLine.map(item => {
            // item区间数据，可能为点
            const start = item.start_date // 第一个区间的起始时间
            const end = item.end_date // 第一个区间的结束时间
            const momentStart = moment(start, 'YYYY-MM-DD')
            if (start === end) {
                // 起始时间 === 结束时间时，为一个点，直接推
                flatTimeLine.push({
                    date: start,
                    price: +item.price,
                    series: `series1`
                })
            } else if (!end) {
                // 最后一个点，未来的区间
                const result = this.fillTimeLine(momentStart, rangeDate[1], item)
                flatTimeLine =  flatTimeLine.concat(result)
            } else {
                const result = this.fillTimeLine(momentStart, end, item)
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
                <Chart height={300} data={data} scale={cols} autoFit>
                    <Legend />
                    <Axis name="date" />
                    <Axis name="price" />
                    <Tooltip
                        crosshairs={{
                            type: 'y',
                        }}
                    />
                    <Geom
                        type="line"
                        position="date*price"
                        size={2}
                        color={['series', colorPlatte]}
                        shape={'hv'}
                    />
                    <Interaction type="legend-filter"/>
                </Chart>
            </>
        );
    }
}
export default AdjustmentChart;
