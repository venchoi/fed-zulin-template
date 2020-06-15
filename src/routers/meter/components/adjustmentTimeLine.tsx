import React, { useEffect, useState } from 'react';
// import { Slider } from 'antd'
import { Chart, Geom, Axis, Tooltip, Legend, Slider } from 'bizcharts';
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
    date: ''
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
    // 从startDate到endDate, 每隔一个月填充一个点
    public fillTimeItem = (startDate: Moment, endDate: Moment, price: number) => {
        const duration = moment.duration(endDate.diff(startDate));
        const durationYears = duration.years();
        const durationMonths = duration.months();
        const fillList = Array(durationYears * 12 + durationMonths);
        for (let i = 0; i < fillList.length; i++) {
            console.log('i startDate', startDate)
            fillList[i] = {
                price: price,
                date: startDate.add(1, 'M').format('YYYY-MM-DD'),
            };
        }
        return fillList
    }
    public fetchData = async () => {
        const { id } = this.props;
        const { rangeDate } = this.state;
        const start_date = rangeDate[0].format('YYYY-MM-DD');
        const end_date = rangeDate[1].format('YYYY-MM-DD');
        let timeLine: ITimeItem[] = []
        let { data = [] } = await getStandardPriceRecord({ meter_standard_price_id: id, start_date, end_date });
        data.map((item: IStandardPriceRecord) => {
            item.price = +item.price;
            item.step_data = JSON.parse(item.step_data || '[]')
            if (item.is_step === '1') {
                // 阶梯价需要填充数据
            } else {

            }
            if (item.end_date) {
                const fillList = this.fillTimeItem(moment(item.start_date, 'YYYY-MM-DD'), moment(item.end_date, 'YYYY-MM-DD'), +item.price);
                console.log('item', item.start_date, item.end_date, fillList)
                timeLine = timeLine.concat(fillList);
            }
            return item;
        });
        const lastItem = (data.length && data[data.length - 1]) || {};
        // 最后一个的结束日期未空，说明未来的时间里都是用的这个单价，剩下的数据需要自动填充
        if (!lastItem.end_date) {
            const lastDate = moment(lastItem.start_date.split('-'));
            const fillList = this.fillTimeItem(lastDate, rangeDate[1], +lastItem.price);
            console.log('timeLine', lastItem.start_date, lastDate.format('YYYY-MM-DD'), rangeDate[1].format('YYYY-MM-DD'))
            timeLine = timeLine.concat(fillList);
        }
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
                </Chart>
            </>
        );
    }
}
export default AdjustmentChart;
