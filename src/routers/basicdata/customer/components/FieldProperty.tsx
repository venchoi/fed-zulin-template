/*
* 可选字段组件
 */
import React, {useState} from 'react';
import {History} from 'history';
import {Input} from 'antd';
import SubSelect from './components/SubSelect';
import './FieldProperty.less'

interface IProps {
    history?: History;
}

const FieldPropertyComponent = (props: IProps) => {
    const arr = ["至尊VIP客户", "VIP客户"];
    const onHandleAdd = () => {
        arr.push("");
    }
    const onHandleDelete = () => {
    }

    return (
        <div className="field-property-wrap">
            <div className="item">
                <div className="title">字段名称:</div>
                <div><Input placeholder="客户级别" disabled/></div>
            </div>
            <div className="item">
                <div className="title">字段类型:</div>
                <div><Input placeholder="客户级别" disabled/></div>
            </div>
            <div>
                <div className="item title">选项设置:</div>
                <div><SubSelect data={arr} onAdd={onHandleAdd} onDelete={onHandleDelete}/></div>
            </div>
            <div className="item">
                <div className="title">是否必填:</div>
                <div><Input placeholder="客户级别" disabled/></div>
            </div>
        </div>
    );

};

export default FieldPropertyComponent
