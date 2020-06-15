import React, { useEffect, useState } from 'react';
// import { Slider } from 'antd'
import { Chart, Geom, Axis, Tooltip, Legend, Interaction } from 'bizcharts';
import { cloneDeep } from 'lodash';
import moment, { Moment } from 'moment';
import { IStandardPriceRecord } from '@t/meter';
import { getStandardPriceRecord } from '@s/meter';

interface IProps {
    id: string;
}
interface IState {
    data: ITimeItem[];
    rangeDate: Moment[];
}
interface ITimeItem {
    price: number;
    date: string
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
    public handleTimeLine = (timeLine: IStandardPriceRecord[]): ITimeItem[] => {
        const flatTimeLine: ITimeItem[] = []; //  填充后的点的数据
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
                    price: +item.price
                })
            } else if (!end) {
                // 最后一个点，未来的区间
                while(momentStart.isBefore(rangeDate[1], 'day')) {
                    flatTimeLine.push({
                        date: momentStart.format('YYYY-MM-DD'),
                        price: +item.price
                    })
                    momentStart.add(1, 'd');
                }
            } else {
                while(momentStart.isBefore(end, 'day')) {
                    flatTimeLine.push({
                        date: momentStart.format('YYYY-MM-DD'),
                        price: +item.price
                    })
                    momentStart.add(1, 'd');
                }
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
                        color={['price', ['#0D86FF']]}
                        shape={'hv'}
                    />
                    <Interaction type="legend-filter"/>
                </Chart>
            </>
        );
    }
}
export default AdjustmentChart;
