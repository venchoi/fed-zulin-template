/*
* 页面配置
 */
import React, { useState } from 'react';
import { History } from 'history';
import { Input  } from 'antd';
import SubHeader from './components/SubHeader'
import './pageSetting.less'

const { Search } = Input;
interface IProps {
    history?: History;
}
const PageSettingComponent = (props: IProps) => {
    return (
        <div className="field-port-wrap">
            <SubHeader name="基本信息" collapse={!0} />
            <div>
                <ul className="filed-ul-wrap">
                    <li className="item dashed">自定义字段</li>
                    <li className="item dashed">自定义组</li>
                    <li className="item dashed">自定义字段</li>
                    <li className="item dashed">自定义组</li>
                </ul>
            </div>
            <SubHeader name="企业资料" collapse={!0} />
            <div>
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

export default PageSettingComponent
