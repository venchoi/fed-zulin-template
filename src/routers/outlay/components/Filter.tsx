import React from 'react';
import { Select, Input, DatePicker } from 'antd';
import TreeProjectSelect from '../../../components/TreeProjectSelect';
import RoomCascader from '../../../components/RoomCascader';

const { Search } = Input;
const { RangePicker } = DatePicker;

const Filter = () => {
    return (
        <div className="filter">
            <TreeProjectSelect isJustSelect={true}></TreeProjectSelect>
            <RangePicker />
            {/* <RoomCascader></RoomCascader> */}
        </div>
    );
};

export default Filter;
