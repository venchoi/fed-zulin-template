/*
* 可选字段组件
 */
import React, { useState } from 'react';
import { History } from 'history';
import { Input  } from 'antd';
import './FieldPorts.less'

const { Search } = Input;
interface IProps {
    history?: History;
}
const FieldPortsComponent = (props: IProps) => {

    return (
        <div className="field-port-wrap">
            <Search
                placeholder="字段名称"
                onSearch={value => console.log(value)}
                className="search-field-input"
            />
            <div>
                <span className="sub-color" style={{ marginTop: 12 }}>自定义字段</span>
                <ul className="filed-ul-wrap">
                    <li className="item dashed">自定义字段</li>
                    <li className="item dashed">自定义组</li>
                    <li className="item dashed">自定义字段</li>
                    <li className="item dashed">自定义组</li>
                </ul>
            </div>
            <div>
                <span className="sub-color">已有字段</span>
                <ul className="filed-ul-wrap">
                    <li className="item">性别</li>
                    <li className="item">手机号码</li>
                    <li className="item">证件号码</li>
                    <li className="item">座机号码</li>
                    <li className="item">邮箱</li>
                    <li className="item">职位信息</li>
                    <li className="item">注册资本</li>
                    <li className="item">备注</li>
                    <li className="item">一二三四五六七八九十</li>
                    <li className="item disabled">禁用字段一</li>
                </ul>
            </div>

        </div>
    );
};

export default FieldPortsComponent
