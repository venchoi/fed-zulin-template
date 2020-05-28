/*
* 二级头部
 */
import React from 'react';
import { Divider } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import './SubHeader.less'

interface IProps {
    name: string;
    collapse: boolean
}
const SubHeaderComponent = (props: IProps) => {
    const { name, collapse } = props;
    return (
        <div className="sub-header-wrap">
            <Divider type="vertical" className="divider" />{name}
            {collapse ? <UpOutlined className="float-right" /> : <DownOutlined className="float-right" /> }
        </div>
    );
};

export default SubHeaderComponent
