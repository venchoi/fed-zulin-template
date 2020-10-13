import React, { useState, useEffect, ChangeEvent } from 'react';
import { Select, Input, DatePicker, Space } from 'antd';
import moment from 'moment';
import RoomCascader from '@c/RoomCascader';
import './Filter.less';
import { SelectedRoomConfig } from '@/components/RoomCascader/index.d';

import { getFeeList } from '../service';
import { getPayParams } from '@/services/common';

import { PaymentMode } from '@/types/common';
import { debounce } from 'lodash';
import { SelectValue } from 'antd/lib/select';
import { GetOutlayListParams, FeeItem } from '../type';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

interface FilterProps {
    projIds: string[];
    projNames: string[];
    filterOptions: GetOutlayListParams; // 筛选条件
    onChange(filterOptions: GetOutlayListParams): void;
}

enum RangePickerType {
    pay,
    order,
}

const Filter = (props: FilterProps) => {
    const [selectedRoomConfig, setSelectedRoomConfig] = useState({
        selectedProjId: '',
        subdistrictId: '',
        buildingId: '',
        floorId: '',
        floorName: '',
        roomId: '',
    });
    const [feeList, setFeeList] = useState<FeeItem[]>([]); // 费项列表
    const [payParamsList, setPayParamsList] = useState<PaymentMode[]>([]); // 付款方式列表
    const [keywords, setKeyWords] = useState('');
    const [RoomCascaderReRender, setRoomCascaderReRender] = useState(false); // 重新房间选择框，因为取消全选项目是渲染异常

    useEffect(() => {
        console.log('===projIds change', props.projIds);
        if (props.projIds.length === 0) {
            return;
        }
        getFeeList({ proj_id: props.projIds.join(',') }).then(json => {
            console.log('getFeeList', json.data);
            setFeeList(json.data);
        });
        getPayParams(1).then(json => {
            setPayParamsList(json.data.PaymentMode);
        });

        // 所选项目有变化，清空所选房间
        setSelectedRoomConfig({
            selectedProjId: '',
            subdistrictId: '',
            buildingId: '',
            floorId: '',
            floorName: '',
            roomId: '',
        });

        setRoomCascaderReRender(false);
        setTimeout(() => {
            setRoomCascaderReRender(true);
        }, 300);
    }, [props.projIds]);

    useEffect(() => {
        setKeyWords(props.filterOptions.keyword || '');
    }, [props.filterOptions.keyword]);

    const handleRoomCascaderChange = debounce((selectedConfig: SelectedRoomConfig) => {
        console.log('===selectedConfig', selectedConfig);
        const {
            stageId,
            subdistrictId = '',
            buildingId = '',
            floorId = '',
            floorName = '',
            roomId = '',
        } = selectedConfig;
        setSelectedRoomConfig({
            selectedProjId: stageId,
            subdistrictId,
            buildingId,
            floorId,
            floorName,
            roomId,
        });
        props.onChange({
            ...props.filterOptions,
            page: 1,
            stage_id: stageId || props.projIds.join(','), // 为空时全选
            room_id: roomId,
            subdistrict_id: subdistrictId,
            building_id: buildingId,
            floor_name: floorName,
        });
    }, 600);

    const handleSelectChange = (name: string, value: SelectValue) => {
        console.log('===handleSelectChange', name, value);
        props.onChange({
            ...props.filterOptions,
            page: 1,
            [name]: (name === 'fee_name' ? value && (value as Array<string>).join(',') : value) || '',
        });
    };

    const handleSearch = (value: string) => {
        props.onChange({
            ...props.filterOptions,
            page: 1,
            keyword: value,
        });
    };

    const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setKeyWords(event.target.value.trim());
    };

    const handleRangePickerChange = (type: RangePickerType, dates: any, dateStrings: [string, string]) => {
        console.log(handleRangePickerChange, type, dates, dateStrings);
        if (type === RangePickerType.pay) {
            props.onChange({
                ...props.filterOptions,
                page: 1,
                start_date: dateStrings[0],
                end_date: dateStrings[1],
            });
        } else if (type === RangePickerType.order) {
            props.onChange({
                ...props.filterOptions,
                page: 1,
                exchange_start_date: dateStrings[0],
                exchange_end_date: dateStrings[1],
            });
        }
    };

    return (
        <div data-component="outlay-filter">
            <Space size={16}>
                {RoomCascaderReRender && (
                    <RoomCascader
                        style={{ width: 216 }}
                        projIds={props.projIds.join(',')}
                        projNames={props.projNames.join(',')}
                        selectedConfig={selectedRoomConfig}
                        onChange={handleRoomCascaderChange}
                    />
                )}
                <Select
                    placeholder="全部费项"
                    mode="multiple"
                    style={{ width: 216 }}
                    showArrow={true}
                    maxTagCount={2}
                    maxTagPlaceholder="..."
                    allowClear
                    onChange={value => handleSelectChange('fee_name', value)}
                    value={(props.filterOptions.fee_name && props.filterOptions.fee_name.split(',')) || undefined}
                >
                    {feeList &&
                        feeList.map((item, index) => (
                            <Option value={item.fee_name} key={index}>
                                {item.fee_name}
                            </Option>
                        ))}
                </Select>
                <Select
                    placeholder="支付方式"
                    style={{ width: 216 }}
                    allowClear
                    onChange={value => handleSelectChange('payment_mode_id', value)}
                    value={props.filterOptions.payment_mode_id || undefined}
                >
                    {payParamsList &&
                        payParamsList.map(item => (
                            <Option value={item.id} key={item.id}>
                                {item.value}
                            </Option>
                        ))}
                </Select>
                <Search
                    style={{ width: 328 }}
                    placeholder="交易号、交易对方、合同编号、退款/收款编号…"
                    value={keywords || undefined}
                    onSearch={handleSearch}
                    onChange={handleChangeSearch}
                    title="交易号、交易对方、合同编号、房间、退款/收款编号、收款账号"
                />
            </Space>
            <br />
            <Space size={16}>
                <div>
                    <RangePicker
                        placeholder={['支付开始日期', '支付结束日期']}
                        format={dateFormat}
                        style={{ width: '328px' }}
                        value={
                            !props.filterOptions.start_date || !props.filterOptions.start_date
                                ? null
                                : ([
                                      moment(props.filterOptions.start_date),
                                      moment(props.filterOptions.end_date),
                                  ] as any)
                        }
                        onChange={(dates: any, dateStrings: [string, string]) =>
                            handleRangePickerChange(RangePickerType.pay, dates, dateStrings)
                        }
                    />
                </div>
                <div>
                    <RangePicker
                        placeholder={['交易开始日期', '交易结束日期']}
                        format={dateFormat}
                        style={{ width: '328px' }}
                        value={
                            !props.filterOptions.exchange_start_date || !props.filterOptions.exchange_end_date
                                ? null
                                : ([
                                      moment(props.filterOptions.exchange_start_date),
                                      moment(props.filterOptions.exchange_end_date),
                                  ] as any)
                        }
                        onChange={(dates: any, dateStrings: [string, string]) =>
                            handleRangePickerChange(RangePickerType.order, dates, dateStrings)
                        }
                    />
                </div>
            </Space>
        </div>
    );
};

export default Filter;