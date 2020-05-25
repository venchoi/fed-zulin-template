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
    onDelete: (params: IDeleteParams) => void;
}
const SubSelectComponent = (props: IProps) => {
    const { data, onAdd, onDelete } = props;
    const handleAdd = () => {
        console.log('ddddd')
        onAdd && onAdd()
    }
    const handleDelete = (index) => {
        onDelete && onDelete(index)
    }
    return (
        <div className="sub-select-wrap">
            {
                data && data.map((item, index) => <div className="item" key={index}><Input className="input"/> <DeleteOutlined title="删除" onClick={handleDelete.bind(null, index)}/></div>)
            }
            <div className="add-btn" onClick={handleAdd}>+ 添加选项</div>
        </div>
    );
};

export default SubSelectComponent
