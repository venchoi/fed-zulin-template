/*
* 二级头部
 */
import React from 'react';
import { Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './SubSelect.less'

interface IDeleteParams {
    index: number;
}
interface IProps {
    data: Array<string>;
    onAdd: () => void;
    onDelete: () => void;
}
const SubSelectComponent = (props: IProps) => {
    const { data, onAdd, onDelete } = props;
    return (
        <div className="sub-select-wrap">
            {
                data && data.map((item, index) => <div className="item" key={index}><Input className="input"/> <DeleteOutlined title="删除" onClick={onDelete}/></div>)
            }
            <div className="add-btn" onClick={onAdd}>+ 添加选项</div>
        </div>
    );
};

export default SubSelectComponent
