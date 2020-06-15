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
    data: IStandardPriceRecord[];
    rangeDate: Moment[];
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
    public fetchData = async () => {
        const { id } = this.props;
        const { rangeDate } = this.state;
        const start_date = rangeDate[0].format('YYYY-MM-DD');
        const end_date = rangeDate[1].format('YYYY-MM-DD');
        let { data: result = [] } = await getStandardPriceRecord({ meter_standard_price_id: id, start_date, end_date });
        result.map((item: IStandardPriceRecord) => {
            item.price = +item.price;
            return item;
        });
        const lastItem = (result.length && result[result.length - 1]) || {};
        // 最后一个的结束日期未空，说明未来的时间里都是用的这个单价，剩下的数据需要自动填充
        if (!lastItem.end_date) {
            const lastDate = moment(lastItem.start_date.split('-'));
            const duration = moment.duration(rangeDate[1].diff(lastDate));
            const durationYears = duration.years();
            const durationMonths = duration.months();
            const fillList = Array(durationYears * 12 + durationMonths).fill({
                price: lastItem.price,
            });
            for (let i = 0; i < fillList.length; i++) {
                fillList[i] = {
                    price: lastItem.price,
                    start_date: lastDate.add(1, 'M').format('YYYY-MM-DD'),
                };
            }
            result = result.concat(fillList);
        }
        this.setState({
            data: result,
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
                    <Axis name="start_date" />
                    <Axis name="price" />
                    <Tooltip
                        crosshairs={{
                            type: 'y',
                        }}
                    />
                    <Geom
                        type="line"
                        position="start_date*price"
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
